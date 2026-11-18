# IBOP Sales Forecasting Service

Initial Phase 2 workstream for company-level **revenue (InvAmt)** and **invoice-volume** forecasting.

## Current scope

- Weekly and monthly forecasts.
- Historical input: the three FY 2023–24, FY 2024–25 and FY 2025–26 invoice CSV exports.
- Revenue target: `InvAmt`, as selected for the initial experiment. Its accounting meaning must be confirmed before production use.
- Invoice volume: count of source invoice rows per period. Confirm that each source row represents one invoice.
- No product-level predictions; these exports do not contain product line items.

The source files contain customer and financial information. Keep them local and do not commit them to this repository.

## Setup

From this directory:

```bash
python -m venv .venv
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# macOS/Linux:
# source .venv/bin/activate
pip install -r requirements.txt
```

## Prepare historical time series

Place the three CSVs in a local folder outside Git, then run:

```bash
python scripts/prepare_data.py --files \
  "PATH/2023-2024 sales csv.csv" \
  "PATH/2024-2025 sales csv.csv" \
  "PATH/2025-2026 sales csv.csv"
```

The script validates required columns, dates, numeric amounts, negative amounts, missing invoice numbers and exact duplicate rows. It does not silently drop suspicious records.

It generates gitignored files under `data/processed/`:

- `daily_sales.csv`
- `weekly_sales.csv`
- `monthly_sales.csv`
- `data_audit.json`

Daily dates without invoices are filled with zero. Before model training, verify that the source exports are complete and that zero-invoice dates reflect actual business activity.

## Forecasting methodology (next stage)

The next implementation step will compare simple seasonal baselines with statistical and tree-based models using chronological backtesting. Revenue and invoice count will be modelled as separate targets. We will report MAE, RMSE and WAPE, and only select a more complex model if it beats the baseline on held-out periods.

Because only three years are available, monthly seasonality and long-horizon weekly predictions must be treated cautiously. The latest source data ends on 2026-03-31, so a model trained only on these files cannot honestly be presented as a current November 2026 forecast.

## Planned integration

The Python service will eventually expose forecasts through FastAPI. The existing Express backend will authenticate IBOP users and proxy requests to the private ML service. The React frontend will not call the ML service directly.
