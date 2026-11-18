"""Train and backtest weekly/monthly company sales forecasts.

Targets are independent: InvAmt revenue and source invoice-row count.
The script uses chronological holdouts, seasonal-naive baselines and
HistGradientBoosting with lag/calendar features. Forecasts are prototypes:
source history ends 2026-03-31.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error


TARGETS = ["revenue", "invoice_count"]
CONFIG = {
    "weekly": {
        "file": "weekly_sales.csv",
        "freq": "W-SUN",
        "horizon": 12,
        "test_size": 12,
        "season": 52,
        "lags": [1, 2, 4, 8, 13, 26, 52],
        "windows": [4, 13, 26],
        "min_train_rows": 45,
    },
    "monthly": {
        "file": "monthly_sales.csv",
        "freq": "MS",
        "horizon": 3,
        "test_size": 6,
        "season": 12,
        "lags": [1, 2, 3, 6, 12],
        "windows": [3, 6, 12],
        "min_train_rows": 18,
    },
}


def make_features(series: pd.Series, date: pd.Timestamp, cfg: dict) -> dict:
    values = series.astype(float).tolist()
    features = {}
    for lag in cfg["lags"]:
        features[f"lag_{lag}"] = values[-lag] if len(values) >= lag else np.nan
    for window in cfg["windows"]:
        tail = values[-window:]
        features[f"rolling_mean_{window}"] = float(np.mean(tail)) if len(tail) == window else np.nan
        features[f"rolling_std_{window}"] = float(np.std(tail, ddof=0)) if len(tail) == window else np.nan
    features["month"] = date.month
    features["quarter"] = date.quarter
    features["year"] = date.year
    if cfg["freq"] == "W-SUN":
        features["week_of_year"] = int(date.isocalendar().week)
    return features


def supervised_frame(series: pd.Series, cfg: dict) -> tuple[pd.DataFrame, pd.Series]:
    rows, targets = [], []
    for idx in range(len(series)):
        date = pd.Timestamp(series.index[idx])
        history = series.iloc[:idx]
        row = make_features(history, date, cfg)
        if all(np.isfinite(v) for v in row.values()):
            rows.append(row)
            targets.append(float(series.iloc[idx]))
    return pd.DataFrame(rows), pd.Series(targets, dtype=float)


def seasonal_naive(history: pd.Series, horizon: int, season: int) -> np.ndarray:
    if len(history) < season:
        return np.repeat(float(history.iloc[-1]), horizon)
    pattern = history.iloc[-season:].to_numpy(dtype=float)
    return np.array([pattern[i % season] for i in range(horizon)], dtype=float)


def recursive_forecast(model, history: pd.Series, horizon: int, cfg: dict) -> np.ndarray:
    values = history.astype(float).copy()
    predictions = []
    offset = pd.tseries.frequencies.to_offset(cfg["freq"])
    for _ in range(horizon):
        next_date = pd.Timestamp(values.index[-1]) + offset
        row = pd.DataFrame([make_features(values, next_date, cfg)])
        prediction = max(0.0, float(model.predict(row)[0]))
        predictions.append(prediction)
        values.loc[next_date] = prediction
    return np.asarray(predictions)


def metrics(actual: np.ndarray, predicted: np.ndarray) -> dict:
    actual = np.asarray(actual, dtype=float)
    predicted = np.asarray(predicted, dtype=float)
    denominator = float(np.abs(actual).sum())
    return {
        "mae": float(mean_absolute_error(actual, predicted)),
        "rmse": float(np.sqrt(mean_squared_error(actual, predicted))),
        "wape_pct": float(np.abs(actual - predicted).sum() / denominator * 100) if denominator else None,
    }


def load_series(path: Path, cfg: dict) -> pd.DataFrame:
    df = pd.read_csv(path, parse_dates=["date"])
    required = {"date", *TARGETS}
    if not required.issubset(df.columns):
        raise ValueError(f"{path} must contain columns {sorted(required)}")
    df = df.set_index("date").sort_index()
    if df.index.has_duplicates:
        raise ValueError(f"Duplicate period dates in {path}")
    return df


def run_target(series: pd.Series, cfg: dict, target: str, artifact_dir: Path) -> dict:
    test_size = min(cfg["test_size"], max(1, len(series) // 4))
    train, test = series.iloc[:-test_size], series.iloc[-test_size:]
    baseline = seasonal_naive(train, len(test), cfg["season"])
    result = {
        "target": target,
        "train_periods": int(len(train)),
        "test_periods": int(len(test)),
        "test_start": str(test.index[0].date()),
        "test_end": str(test.index[-1].date()),
        "seasonal_naive": metrics(test.to_numpy(), baseline),
    }

    X_train, y_train = supervised_frame(train, cfg)
    if len(X_train) >= cfg["min_train_rows"]:
        model = HistGradientBoostingRegressor(
            max_iter=250,
            learning_rate=0.05,
            max_leaf_nodes=7,
            l2_regularization=2.0,
            random_state=42,
        )
        model.fit(X_train, y_train)
        ml_predictions = recursive_forecast(model, train, len(test), cfg)
        result["hist_gradient_boosting"] = metrics(test.to_numpy(), ml_predictions)
        result["selected_model_candidate"] = (
            "hist_gradient_boosting"
            if result["hist_gradient_boosting"]["wape_pct"] < result["seasonal_naive"]["wape_pct"]
            else "seasonal_naive"
        )
        # Refit on all available history for future forecasting.
        X_all, y_all = supervised_frame(series, cfg)
        if len(X_all) >= cfg["min_train_rows"]:
            final_model = HistGradientBoostingRegressor(
                max_iter=250, learning_rate=0.05, max_leaf_nodes=7,
                l2_regularization=2.0, random_state=42,
            )
            final_model.fit(X_all, y_all)
            joblib.dump(final_model, artifact_dir / f"{target}_{cfg['freq']}_histgb.joblib")
            result["_model"] = final_model
    else:
        result["hist_gradient_boosting"] = None
        result["selected_model_candidate"] = "seasonal_naive"
        result["note"] = "Not enough lagged training rows for the ML candidate."

    result["_test_actual"] = test
    result["_test_baseline"] = baseline
    return result


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-dir", default="data/processed")
    parser.add_argument("--output-dir", default="reports")
    parser.add_argument("--artifact-dir", default="artifacts")
    args = parser.parse_args()

    data_dir, output_dir, artifact_dir = Path(args.data_dir), Path(args.output_dir), Path(args.artifact_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    artifact_dir.mkdir(parents=True, exist_ok=True)

    report = {
        "source_data_cutoff": "2026-03-31",
        "warning": "Historical prototype only. No data after 2026-03-31 is available in the supplied exports.",
        "targets": {},
        "forecasts": {},
    }

    for granularity, cfg in CONFIG.items():
        frame = load_series(data_dir / cfg["file"], cfg)
        report["forecasts"][granularity] = {}
        for target in TARGETS:
            result = run_target(frame[target], cfg, target, artifact_dir)
            model = result.pop("_model", None)
            result.pop("_test_actual", None)
            result.pop("_test_baseline", None)
            report["targets"][f"{granularity}_{target}"] = result

            if model is not None and result["selected_model_candidate"] == "hist_gradient_boosting":
                future = recursive_forecast(model, frame[target], cfg["horizon"], cfg)
                method = "hist_gradient_boosting"
            else:
                future = seasonal_naive(frame[target], cfg["horizon"], cfg["season"])
                method = "seasonal_naive"

            offset = pd.tseries.frequencies.to_offset(cfg["freq"])
            dates = [pd.Timestamp(frame.index[-1]) + offset * (i + 1) for i in range(cfg["horizon"])]
            report["forecasts"][granularity][target] = {
                "method": method,
                "periods": [
                    {"period_start": d.strftime("%Y-%m-%d"), "prediction": round(max(0.0, float(v)), 2)}
                    for d, v in zip(dates, future)
                ],
            }

    (output_dir / "forecast_report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
