"""Rolling-origin validation for IBOP weekly and monthly sales forecasting.

Uses expanding-window chronological folds. Each fold forecasts the next complete
horizon without seeing its targets. Models are selected by mean fold WAPE, with
seasonal-naive as the baseline. No random train/test split is used.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error

TARGETS = ["revenue", "invoice_count"]
CONFIG = {
    "weekly": {
        "file": "weekly_sales.csv", "freq": "W-TUE",
        "horizon": 12, "season": 52,
        "lags": [1, 2, 4, 8, 13, 26, 52],
        "windows": [4, 13, 26], "min_train_rows": 45,
        "initial_train": 78, "step": 12, "max_folds": 5,
    },
    "monthly": {
        "file": "monthly_sales.csv", "freq": "MS",
        "horizon": 3, "season": 12,
        "lags": [1, 2, 3, 6, 12],
        "windows": [3, 6, 12], "min_train_rows": 18,
        "initial_train": 18, "step": 3, "max_folds": 5,
    },
}


def features(history: pd.Series, next_date: pd.Timestamp, cfg: dict) -> dict:
    vals = history.astype(float).to_numpy()
    row = {}
    for lag in cfg["lags"]:
        row[f"lag_{lag}"] = float(vals[-lag]) if len(vals) >= lag else np.nan
    for window in cfg["windows"]:
        tail = vals[-window:]
        row[f"mean_{window}"] = float(np.mean(tail)) if len(tail) == window else np.nan
        row[f"std_{window}"] = float(np.std(tail)) if len(tail) == window else np.nan
    row["month"] = next_date.month
    row["quarter"] = next_date.quarter
    row["year"] = next_date.year
    if cfg["freq"] == "W-TUE":
        row["week_of_year"] = int(next_date.isocalendar().week)
    return row


def make_supervised(series: pd.Series, cfg: dict):
    rows, y = [], []
    for i in range(len(series)):
        hist = series.iloc[:i]
        row = features(hist, pd.Timestamp(series.index[i]), cfg)
        if row and all(np.isfinite(v) for v in row.values()):
            rows.append(row)
            y.append(float(series.iloc[i]))
    return pd.DataFrame(rows), np.asarray(y, dtype=float)


def seasonal_naive(history: pd.Series, horizon: int, season: int) -> np.ndarray:
    if len(history) < season:
        return np.repeat(float(history.iloc[-1]), horizon)
    pattern = history.iloc[-season:].to_numpy(dtype=float)
    return np.asarray([pattern[i % season] for i in range(horizon)])


def recursive_ml(model, history: pd.Series, horizon: int, cfg: dict) -> np.ndarray:
    simulated = history.astype(float).copy()
    offset = pd.tseries.frequencies.to_offset(cfg["freq"])
    output = []
    for _ in range(horizon):
        next_date = pd.Timestamp(simulated.index[-1]) + offset
        X = pd.DataFrame([features(simulated, next_date, cfg)])
        value = max(0.0, float(model.predict(X)[0]))
        output.append(value)
        simulated.loc[next_date] = value
    return np.asarray(output)


def fit_ml(history: pd.Series, cfg: dict):
    X, y = make_supervised(history, cfg)
    if len(X) < cfg["min_train_rows"]:
        return None
    model = HistGradientBoostingRegressor(
        max_iter=250, learning_rate=0.05, max_leaf_nodes=7,
        l2_regularization=2.0, random_state=42,
    )
    model.fit(X, y)
    return model


def score(actual, predicted):
    actual = np.asarray(actual, dtype=float)
    predicted = np.asarray(predicted, dtype=float)
    denom = float(np.abs(actual).sum())
    return {
        "mae": float(mean_absolute_error(actual, predicted)),
        "rmse": float(np.sqrt(mean_squared_error(actual, predicted))),
        "wape_pct": float(np.abs(actual - predicted).sum() / denom * 100) if denom else None,
    }


def load_frame(path: Path) -> pd.DataFrame:
    frame = pd.read_csv(path, parse_dates=["date"]).set_index("date").sort_index()
    missing = set(TARGETS) - set(frame.columns)
    if missing:
        raise ValueError(f"{path} missing columns: {sorted(missing)}")
    if frame.index.has_duplicates:
        raise ValueError(f"Duplicate time periods in {path}")
    return frame


def rolling_backtest(series: pd.Series, cfg: dict) -> dict:
    folds = []
    start = cfg["initial_train"]
    max_start = len(series) - cfg["horizon"]
    starts = list(range(start, max_start + 1, cfg["step"]))[-cfg["max_folds"]:]
    for fold_no, split in enumerate(starts, start=1):
        train = series.iloc[:split]
        actual = series.iloc[split:split + cfg["horizon"]]
        if len(actual) != cfg["horizon"]:
            continue
        base = seasonal_naive(train, len(actual), cfg["season"])
        fold = {
            "fold": fold_no,
            "train_end": str(train.index[-1].date()),
            "test_start": str(actual.index[0].date()),
            "test_end": str(actual.index[-1].date()),
            "seasonal_naive": score(actual, base),
            "hist_gradient_boosting": None,
        }
        model = fit_ml(train, cfg)
        if model is not None:
            fold["hist_gradient_boosting"] = score(
                actual, recursive_ml(model, train, len(actual), cfg)
            )
        folds.append(fold)

    def aggregate(key):
        available = [f[key]["wape_pct"] for f in folds if f[key] is not None and f[key]["wape_pct"] is not None]
        return float(np.mean(available)) if available else None

    baseline_wape = aggregate("seasonal_naive")
    ml_wape = aggregate("hist_gradient_boosting")
    selected = "hist_gradient_boosting" if ml_wape is not None and baseline_wape is not None and ml_wape < baseline_wape else "seasonal_naive"
    return {
        "fold_count": len(folds),
        "mean_seasonal_naive_wape_pct": baseline_wape,
        "mean_hist_gradient_boosting_wape_pct": ml_wape,
        "selected_model": selected,
        "folds": folds,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-dir", default="data/processed")
    parser.add_argument("--output-dir", default="reports")
    parser.add_argument("--artifact-dir", default="artifacts")
    args = parser.parse_args()
    data_dir, out_dir, artifact_dir = Path(args.data_dir), Path(args.output_dir), Path(args.artifact_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    artifact_dir.mkdir(parents=True, exist_ok=True)

    report = {
        "source_data_cutoff": "2026-03-31",
        "warning": "Historical backtest only. Source data does not include records after 2026-03-31.",
        "selection_rule": "Choose HistGradientBoosting only when mean rolling-fold WAPE is lower than seasonal-naive WAPE.",
        "results": {},
        "forecasts": {},
    }

    for granularity, cfg in CONFIG.items():
        frame = load_frame(data_dir / cfg["file"])
        report["forecasts"][granularity] = {}
        for target in TARGETS:
            series = frame[target].astype(float)
            validation = rolling_backtest(series, cfg)
            final_model = fit_ml(series, cfg)
            report["results"][f"{granularity}_{target}"] = validation
            selected = validation["selected_model"]
            if selected == "hist_gradient_boosting" and final_model is not None:
                future = recursive_ml(final_model, series, cfg["horizon"], cfg)
                model_file = artifact_dir / f"{granularity}_{target}_histgb.joblib"
                import joblib
                joblib.dump(final_model, model_file)
                method = "hist_gradient_boosting"
            else:
                future = seasonal_naive(series, cfg["horizon"], cfg["season"])
                method = "seasonal_naive"

            offset = pd.tseries.frequencies.to_offset(cfg["freq"])
            periods = []
            for i, value in enumerate(future, start=1):
                next_period = pd.Timestamp(series.index[-1]) + offset * i
                periods.append({
                    "period_ending" if granularity == "weekly" else "period_start": next_period.strftime("%Y-%m-%d"),
                    "prediction": round(max(0.0, float(value)), 2),
                })
            report["forecasts"][granularity][target] = {
                "method": method,
                "horizon": cfg["horizon"],
                "periods": periods,
            }

    (out_dir / "rolling_backtest.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
