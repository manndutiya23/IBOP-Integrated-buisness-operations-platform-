import { useMemo, useRef, useState } from "react";
import { useBusinessData } from "../context/BusinessDataContext";
import API from "../utils/axiosConfig";
import { useAuth } from "../context/AuthContext";

import { PageHeader, PageSection } from "../components/Ui";
import {
  ProductKPIs,
  ProductToolbar,
  ProductTable,
  ProductForm,
} from "../components/products";

const CSV_HEADERS = [
  "Product Code",
  "Nick",
  "Manufacturer / Division",
  "Product Name",
  "Type",
  "IGST%",
  "CGST/CST%",
  "SGST/VAT%",
  "HSN Code",
];

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  if (quoted) throw new Error("The CSV contains an unclosed quoted field.");
  row.push(cell);
  if (row.some((value) => value.trim() !== "")) rows.push(row);

  if (rows.length < 2) throw new Error("The CSV must contain a header row and at least one product.");

  const headers = rows[0].map((header) => header.trim().replace(/^\uFEFF/, ""));
  const missingHeaders = CSV_HEADERS.filter((header) => !headers.includes(header));
  if (missingHeaders.length) {
    throw new Error(`Missing required CSV columns: ${missingHeaders.join(", ")}`);
  }

  return rows.slice(1).map((values, index) => {
    const record = {};
    headers.forEach((header, columnIndex) => {
      record[header] = values[columnIndex] ?? "";
    });
    record.__sourceRow = index + 2;
    return record;
  });
}

function Products() {
  const { products, addProduct, refreshProducts } = useBusinessData();
  const { user } = useAuth();
  const role = user?.role;
  const canManage = role === "Admin" || role === "Supply Chain";
  const canImport = role === "Admin" || role === "Supply Chain";
  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [formData, setFormData] = useState({
    productCode: "",
    nick: "",
    manufacturerDivision: "",
    name: "",
    productType: "",
    igstRate: "",
    cgstRate: "",
    sgstRate: "",
    hsnCode: "",
  });
  const [importRows, setImportRows] = useState([]);
  const [importFileName, setImportFileName] = useState("");
  const [importReport, setImportReport] = useState(null);
  const [importError, setImportError] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const productTypes = useMemo(
    () => [...new Set(products.map((product) => product.productType).filter(Boolean))].sort(),
    [products]
  );

  const filteredProducts = useMemo(() => products.filter((product) => {
    const searchable = [
      product.productCode,
      product.name,
      product.nick,
      product.manufacturerDivision,
      product.hsnCode,
    ].filter(Boolean).join(" ").toLowerCase();

    const matchesSearch = searchable.includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "All" || product.productType === typeFilter;
    const stock = Number(product.stock || 0);
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "In Stock" && stock > 10) ||
      (statusFilter === "Low Stock" && stock > 0 && stock <= 10) ||
      (statusFilter === "Out of Stock" && stock === 0);

    return matchesSearch && matchesType && matchesStatus;
  }), [products, searchTerm, typeFilter, statusFilter]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...formData,
        igstRate: formData.igstRate === "" ? undefined : Number(formData.igstRate),
        cgstRate: formData.cgstRate === "" ? undefined : Number(formData.cgstRate),
        sgstRate: formData.sgstRate === "" ? undefined : Number(formData.sgstRate),
      };
      const response = await API.post("/products", payload);
      addProduct(response.data);
      setFormData({
        productCode: "",
        nick: "",
        manufacturerDivision: "",
        name: "",
        productType: "",
        igstRate: "",
        cgstRate: "",
        sgstRate: "",
        hsnCode: "",
      });
    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);
      window.alert(error.response?.data?.message || "Failed to add product.");
    }
  };

  const handleCsvSelection = async (event) => {
    const file = event.target.files?.[0];
    setImportError("");
    setImportReport(null);
    setImportRows([]);
    setImportFileName("");

    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setImportError("Please select a CSV file.");
      event.target.value = "";
      return;
    }

    try {
      const text = await file.text();
      const parsedRows = parseCsv(text);
      setImportRows(parsedRows);
      setImportFileName(file.name);
    } catch (error) {
      setImportError(error.message || "Unable to read this CSV file.");
      event.target.value = "";
    }
  };

  const runImport = async (dryRun) => {
    if (!importRows.length) return;
    setIsImporting(true);
    setImportError("");
    try {
      const response = await API.post("/products/import", { rows: importRows, dryRun });
      setImportReport(response.data.report);
      if (!dryRun) {
        await refreshProducts();
      }
    } catch (error) {
      console.error("PRODUCT IMPORT ERROR:", error);
      setImportError(error.response?.data?.message || "Product import failed.");
      if (error.response?.data?.report) setImportReport(error.response.data.report);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Product Master"
        title="Products"
        subtitle="Maintain the approved product catalogue used across procurement, inventory and sales."
      />

      <ProductKPIs products={products} />

      <PageSection
        title="Product Catalogue"
        subtitle="Search the product master by code, name, nickname, manufacturer or HSN."
      >
        <ProductToolbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          productTypes={productTypes}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onAddProduct={() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          onImport={() => fileInputRef.current?.click()}
          canManage={canManage}
          canImport={canImport}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={handleCsvSelection}
          hidden
        />
        <ProductTable products={filteredProducts} />
      </PageSection>

      {canImport && (
        <PageSection
          title="Bulk Catalogue Import"
          subtitle="Upload the Product Manufacturer List CSV. Start with a dry run; no database changes occur until you apply the import."
        >
          <div className="product-import">
            <div className="product-import__upload">
              <div>
                <strong>{importFileName || "No CSV selected"}</strong>
                <p>{importRows.length ? `${importRows.length.toLocaleString()} product rows ready for validation` : "Expected columns include Product Code, Product Name, manufacturer, tax rates and HSN."}</p>
              </div>
              <button type="button" className="ui-button ui-button--secondary" onClick={() => fileInputRef.current?.click()}>
                Choose CSV
              </button>
            </div>

            {importError && <p className="product-import__error" role="alert">{importError}</p>}

            {importRows.length > 0 && (
              <div className="product-import__actions">
                <button type="button" className="ui-button ui-button--secondary" disabled={isImporting} onClick={() => runImport(true)}>
                  {isImporting ? "Working..." : "Validate CSV"}
                </button>
                <button
                  type="button"
                  className="ui-button ui-button--primary"
                  disabled={isImporting || !importReport || importReport.validRows === 0}
                  onClick={() => {
                    if (window.confirm("Apply this catalogue import? Existing stock, price, batch and expiry values will be preserved.")) {
                      runImport(false);
                    }
                  }}
                >
                  Apply Import
                </button>
              </div>
            )}

            {importReport && (
              <div className="product-import__report" aria-live="polite">
                <div><strong>{importReport.totalRows}</strong><span>Total rows</span></div>
                <div><strong>{importReport.validRows}</strong><span>Valid</span></div>
                <div><strong>{importReport.invalidRows}</strong><span>Invalid</span></div>
                <div><strong>{importReport.newProducts}</strong><span>New products</span></div>
                <div><strong>{importReport.existingProductsToUpdate}</strong><span>Existing updates</span></div>
                {importReport.invalid?.length > 0 && (
                  <div className="product-import__issues">
                    <strong>Rows requiring attention</strong>
                    <ul>
                      {importReport.invalid.slice(0, 20).map((issue) => (
                        <li key={issue.rowNumber}>Row {issue.rowNumber} ({issue.productCode || "no code"}): {issue.errors.join("; ")}</li>
                      ))}
                    </ul>
                    {importReport.invalid.length > 20 && <p>Showing first 20 invalid rows.</p>}
                  </div>
                )}
              </div>
            )}
          </div>
        </PageSection>
      )}

      {canManage && (
        <div ref={formRef}>
          <PageSection
            title="Add Product to Master"
            subtitle="Create a catalogue record only. Opening stock and purchase pricing are recorded through inventory and procurement workflows."
          >
            <ProductForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />
          </PageSection>
        </div>
      )}
    </>
  );
}

export default Products;
