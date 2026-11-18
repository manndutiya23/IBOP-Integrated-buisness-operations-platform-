"""Combine IBOP invoice exports and build daily, weekly and monthly time series.

The raw CSV files are intentionally supplied locally and are never committed.
InvAmt is the configured initial revenue target; confirm its accounting meaning
with the business before treating forecasts as recognised net revenue.
"""
from __future__ import annotations

import argparse
from pathlib import Path
import json

import numpy as np
import pandas as pd

REQUIRED_COLUMNS = {"InvNo", "InvDate", "InvAmt"}
DATE_FORMAT = "%d-%m-%Y"


def load_exports(paths: list[Path]) -> pd.DataFrame:
    frames = []
    for path in paths:
        if not path.exists():
            raise FileNotFoundError(f"CSV not found: {path}")
        frame = pd.read_csv(path)
        missing = REQUIRED_COLUMNS - set(frame.columns)
        if missing:
            raise ValueError(f"{path.name} is missing required columns: {sorted(missing)}")
        frame = frame.copy()
        frame["source_file"] = path.name
        frames.append(frame)

    data = pd.concat(frames, ignore_index=True)
    data["invoice_date"] = pd.to_datetime(
        data["InvDate"].astype(str).str.strip(),
        format=DATE_FORMAT,
        errors="coerce",
    )
    data["invoice_amount"] = pd.to_numeric(data["InvAmt"], errors="coerce")
    data["invoice_number"] = data["InvNo"].astype("string").str.strip()

    invalid_dates = int(data["invoice_date"].isna().sum())
    invalid_amounts = int(data["invoice_amount"].isna().sum())
    if invalid_dates:
        raise ValueError(f"Found {invalid_dates} rows with invalid invoice dates.")
    if invalid_amounts:
        raise ValueError(f"Found {invalid_amounts} rows with invalid InvAmt values.")
    if (data["invoice_amount"] < 0).any():
        raise ValueError("Negative InvAmt values found; inspect credit notes/adjustments before training.")
    if data["invoice_number"].isna().any() or data["invoice_number"].eq("").any():
        raise ValueError("Missing invoice numbers found.")

    # Invoice numbers restart each financial year, so do not deduplicate by
    # invoice number alone. Exact duplicate rows are reported for manual review.
    exact_duplicates = int(data.duplicated(subset=[c for c in data.columns if c != "source_file"]).sum())
    if exact_duplicates:
        raise ValueError(
            f"Found {exact_duplicates} exact duplicate invoice rows across exports. "
            "Resolve them before training; no rows were silently removed."
        )

    return data.sort_values(["invoice_date", "invoice_number"]).reset_index(drop=True)


def build_series(data: pd.DataFrame, output_dir: Path) -> dict:
    output_dir.mkdir(parents=True, exist_ok=True)

    daily = (
        data.groupby("invoice_date")
        .agg(revenue=("invoice_amount", "sum"), invoice_count=("invoice_number", "count"))
        .sort_index()
    )
    full_index = pd.date_range(daily.index.min(), daily.index.max(), freq="D")
    daily = daily.reindex(full_index, fill_value=0)
    daily.index.name = "date"
    daily["revenue"] = daily["revenue"].astype(float)
    daily["invoice_count"] = daily["invoice_count"].astype(int)

    weekly = daily.resample("W-TUE").agg(
        revenue=("revenue", "sum"),
        invoice_count=("invoice_count", "sum"),
    )
    monthly = daily.resample("MS").agg(
        revenue=("revenue", "sum"),
        invoice_count=("invoice_count", "sum"),
    )

    daily.to_csv(output_dir / "daily_sales.csv", date_format="%Y-%m-%d")
    weekly.to_csv(output_dir / "weekly_sales.csv", date_format="%Y-%m-%d")
    monthly.to_csv(output_dir / "monthly_sales.csv", date_format="%Y-%m-%d")

    report = {
        "source_rows": int(len(data)),
        "unique_invoice_dates": int(data["invoice_date"].nunique()),
        "date_start": data["invoice_date"].min().strftime("%Y-%m-%d"),
        "date_end": data["invoice_date"].max().strftime("%Y-%m-%d"),
        "daily_observations_including_zero_days": int(len(daily)),
        "weekly_observations": int(len(weekly)),
        "monthly_observations": int(len(monthly)),
        "revenue_target": "InvAmt",
        "total_invamt": round(float(data["invoice_amount"].sum()), 2),
        "total_invoice_rows": int(data["invoice_number"].count()),
        "zero_invoice_days": int((daily["invoice_count"] == 0).sum()),
        "exact_duplicate_rows": int(data.duplicated(subset=[c for c in data.columns if c != "source_file"]).sum()),
        "notes": [
            "InvAmt is used as the user-selected initial revenue target; accounting definition is not independently verified.",
            "Invoice count is the number of invoice rows. Confirm that each source row represents exactly one invoice.",
            "Zero-sales dates are filled with zero; confirm business closure days and source export completeness.",
            "The source exports end on 2026-03-31; forecasts are historical prototypes, not current November 2026 forecasts."
        ],
    }
    (output_dir / "data_audit.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    return report


def main() -> None:
    parser = argparse.ArgumentParser(description="Prepare IBOP historical sales time series.")
    parser.add_argument("--files", nargs="+", required=True, help="Paths to the three source CSV exports.")
    parser.add_argument("--output-dir", default="data/processed", help="Output directory (gitignored).")
    args = parser.parse_args()

    data = load_exports([Path(p) for p in args.files])
    report = build_series(data, Path(args.output_dir))
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
