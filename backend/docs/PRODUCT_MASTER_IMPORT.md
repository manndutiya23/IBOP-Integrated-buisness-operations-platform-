# Product Master Import

This feature imports the Shrinath Enterprises product catalogue into the existing MongoDB Product collection.

## Important data separation

- Product Master fields: product code, nickname, manufacturer/division, product name, type, tax rates and HSN code.
- Physical inventory fields: price, stock, batch number and expiry date.
- Catalogue import never changes physical inventory fields.
- Newly created catalogue records start with price = 0 and stock = 0. These are placeholders, not business valuations or opening stock.

## CSV columns expected

The API accepts rows converted from the CSV into JSON objects using these exact source headers:

- Product Code
- Nick
- Manufacturer / Division
- Product Name
- Type
- IGST%
- CGST/CST%
- SGST/VAT%
- HSN Code

Keep Product Code as a string so leading zeroes, if any, are preserved.

## API

Both endpoints require authentication and Admin or Supply Chain role.

### Dry run (no writes)

```http
POST /api/products/import
Content-Type: application/json
Authorization: Bearer <token>
```

```json
{
  "dryRun": true,
  "rows": [
    {
      "Product Code": "11760",
      "Nick": "JM",
      "Manufacturer / Division": "3M MICROPORE",
      "Product Name": "DURAPORE 1\"1538",
      "Type": "PCS",
      "IGST%": "5",
      "CGST/CST%": "2.5",
      "SGST/VAT%": "2.5",
      "HSN Code": "30051010"
    }
  ]
}
```

The response reports total, valid and invalid rows, new products, existing products to update, and row-level validation errors.

### Apply import

After reviewing the dry-run report, send the same payload with `"dryRun": false`.

- Product Code is the stable upsert key.
- Duplicate codes within the uploaded file invalidate all rows with that code.
- Rows missing Product Code or Product Name are rejected.
- Tax rates must be non-negative numbers when supplied.
- Invalid rows are skipped and reported; valid rows are imported.
- Re-importing the same catalogue does not create duplicate product records.
- Existing stock, price, batch number and expiry date are not changed.

Maximum request size is 10,000 rows; Express JSON body limit is 10 MB.

## Before using real data

1. Use a non-production MongoDB database.
2. Back up the database before the first applied import.
3. Run dry-run and review every invalid row.
4. Confirm tax and HSN data with the business; this importer preserves source values and does not certify tax correctness.
5. Apply the import.
6. Verify product count and sample product codes in MongoDB.
7. Verify existing inventory records retain their stock, price, batch and expiry values.
