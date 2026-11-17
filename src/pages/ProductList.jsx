import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../utils/axiosConfig";
import {
  Button,
  Card,
  DataTable,
  EmptyState,
  Input,
  KPICard,
  LoadingSpinner,
  PageHeader,
  PageSection,
  Select,
  StatusBadge,
} from "../components/Ui";
import "./ProductList.css";


const parseCsv = (text) => {
  const rows=[]; let row=[]; let value=""; let quoted=false;
  for(let i=0;i<text.length;i+=1){const ch=text[i];
    if(ch==='"'){if(quoted&&text[i+1]==='"'){value+='"';i+=1;}else quoted=!quoted;}
    else if(ch===","&&!quoted){row.push(value);value="";}
    else if((ch==="\\n"||ch==="\\r")&&!quoted){if(ch==="\\r"&&text[i+1]==="\\n")i+=1;row.push(value);value="";if(row.some(v=>v.trim()))rows.push(row);row=[];}
    else value+=ch;
  }
  row.push(value);if(row.some(v=>v.trim()))rows.push(row);return rows;
};
const normalizeHeader=(header)=>header.replace(/^\\uFEFF/,"").trim().toLowerCase().replace(/\\s+/g," ");

const displayValue = (value) =>
  value === null || value === undefined || value === "" ? "—" : value;

function ProductList() {
  const { user } = useAuth();
  const canCreate = ["Admin", "Supply Chain"].includes(user?.role);
  const canDelete = ["Admin", "Supply Chain"].includes(user?.role);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [manufacturerFilter, setManufacturerFilter] = useState("All");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bulkFile,setBulkFile]=useState(null);
  const [bulkRows,setBulkRows]=useState([]);
  const [bulkError,setBulkError]=useState("");
  const [bulkBusy,setBulkBusy]=useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [formData, setFormData] = useState({ productCode: "", name: "", nick: "", manufacturerDivision: "", productType: "", hsnCode: "", igstRate: "", cgstRate: "", sgstRate: "" });

  useEffect(() => {
    let active = true;

    const loadCatalogue = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await API.get("/product-catalogue");
        if (active) {
          setProducts(Array.isArray(response.data) ? response.data : []);
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError.response?.status === 403
              ? "Your account does not have permission to view the product catalogue."
              : requestError.response?.data?.message ||
                  "Could not load the product catalogue. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadCatalogue();
    return () => {
      active = false;
    };
  }, []);

  const productTypes = useMemo(
    () => [...new Set(products.map((product) => product.productType).filter(Boolean))].sort(),
    [products]
  );

  const manufacturers = useMemo(
    () => [...new Set(products.map((product) => product.manufacturerDivision).filter(Boolean))].sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const searchable = [
        product.productCode,
        product.nick,
        product.name,
        product.manufacturerDivision,
        product.productType,
        product.hsnCode,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (!query || searchable.includes(query)) &&
        (typeFilter === "All" || product.productType === typeFilter) &&
        (manufacturerFilter === "All" ||
          product.manufacturerDivision === manufacturerFilter)
      );
    });
  }, [products, searchTerm, typeFilter, manufacturerFilter]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setFormError("");
    setFormSuccess("");
  };

  const handleCreateProduct = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFormError("");
    setFormSuccess("");
    const payload = {
      ...formData,
      productCode: formData.productCode.trim(),
      name: formData.name.trim(),
      igstRate: formData.igstRate === "" ? null : Number(formData.igstRate),
      cgstRate: formData.cgstRate === "" ? null : Number(formData.cgstRate),
      sgstRate: formData.sgstRate === "" ? null : Number(formData.sgstRate),
    };
    try {
      const response = await API.post("/product-catalogue", payload);
      setProducts((current) => [...current, response.data.product].sort((a, b) =>
        a.productCode.localeCompare(b.productCode, undefined, { numeric: true, sensitivity: "base" })
      ));
      setFormData({ productCode: "", name: "", nick: "", manufacturerDivision: "", productType: "", hsnCode: "", igstRate: "", cgstRate: "", sgstRate: "" });
      setShowCreateForm(false);
      setFormSuccess(response.data.message || "Product added to the catalogue.");
    } catch (requestError) {
      const apiErrors = requestError.response?.data?.errors;
      setFormError(apiErrors?.length ? apiErrors.join(" ") : requestError.response?.data?.message || "Unable to add product.");
    } finally {
      setSaving(false);
    }
  };


  const handleBulkFileChange=async(event)=>{
    const file=event.target.files?.[0];setBulkFile(file||null);setBulkRows([]);setBulkError("");if(!file)return;
    if(!file.name.toLowerCase().endsWith(".csv")){setBulkError("Please select a CSV exported from the Product Manufacturer List.");return;}
    try{
      const rows=parseCsv((await file.text()).replace(/^\\uFEFF/,""));if(rows.length<2)throw new Error("CSV must contain headers and at least one product row.");
      const h=rows[0].map(normalizeHeader), ix={productCode:h.indexOf("product code"),name:h.indexOf("product name"),nick:h.indexOf("nick"),manufacturerDivision:h.indexOf("manufacturer / division"),productType:h.indexOf("type"),igstRate:h.indexOf("igst%"),cgstRate:h.indexOf("cgst/cst%"),sgstRate:h.indexOf("sgst/vat%"),hsnCode:h.indexOf("hsn code")};
      if(ix.productCode<0||ix.name<0)throw new Error("Required columns Product Code and Product Name were not found. Use the original Product Manufacturer List headers.");
      const parsed=rows.slice(1).map(c=>{const get=k=>ix[k]<0?"":(c[ix[k]]||"").trim();return{productCode:get("productCode"),name:get("name"),nick:get("nick"),manufacturerDivision:get("manufacturerDivision"),productType:get("productType"),igstRate:get("igstRate"),cgstRate:get("cgstRate"),sgstRate:get("sgstRate"),hsnCode:get("hsnCode")};}).filter(p=>p.productCode||p.name);
      if(!parsed.length)throw new Error("No product rows found.");setBulkRows(parsed);
    }catch(err){setBulkError(err.message||"Unable to read CSV.");}
  };
  const handleBulkImport=async()=>{
    if(!bulkRows.length||!window.confirm(`Import ${bulkRows.length.toLocaleString("en-IN")} rows? Existing Product Codes will be skipped. Warehouse stock will not change.`))return;
    setBulkBusy(true);setBulkError("");setFormSuccess("");
    try{const response=await API.post("/product-catalogue/bulk-import",{products:bulkRows});const summary=response.data.summary||{};const refreshed=await API.get("/product-catalogue");setProducts(Array.isArray(refreshed.data)?refreshed.data:[]);
      setFormSuccess(`Import complete: ${summary.inserted||response.data.inserted||0} added; ${summary.skippedExisting||0} already existed; ${summary.skippedDuplicateInFile||0} duplicate rows; ${summary.skippedInvalid||0} invalid rows.`);
      setBulkFile(null);setBulkRows([]);const input=document.getElementById("product-catalogue-csv");if(input)input.value="";
      if(response.data.errors?.length)setBulkError(response.data.errors.join(" "));
    }catch(err){setBulkError(err.response?.data?.message||"Bulk import failed.");}finally{setBulkBusy(false);}
  };

  const handleDeleteProduct = async (product) => {
    const confirmed = window.confirm(
      `Delete "${product.name}" (Product Code: ${product.productCode}) from the product catalogue?\\n\\nThis action cannot be undone. It will not change warehouse inventory or existing stock records.`
    );

    if (!confirmed) return;

    setDeletingProductId(product._id);
    setFormError("");
    setFormSuccess("");

    try {
      const response = await API.delete(`/product-catalogue/${product._id}`);
      setProducts((current) => current.filter((item) => item._id !== product._id));
      setFormSuccess(response.data.message || "Product removed from the catalogue.");
    } catch (requestError) {
      setFormError(
        requestError.response?.data?.message ||
          "Unable to delete this product. Please try again."
      );
    } finally {
      setDeletingProductId(null);
    }
  };

  const missingHsnCount = products.filter((product) => !product.hsnCode).length;
  const classifiedCount = products.filter((product) => product.productType).length;

  return (
    <div className="product-list-page">
      <PageHeader
        eyebrow="Supply Chain"
        title="Product List"
        subtitle="Browse the products Shrinath Enterprises deals in. This catalogue is separate from physical warehouse inventory."
      />

      {canCreate && (<>
        <div className="product-list-page__create-actions">
          <Button variant="secondary" onClick={()=>{setBulkError("");document.getElementById("product-catalogue-csv")?.click();}}>Bulk Upload CSV</Button>
          <input id="product-catalogue-csv" type="file" accept=".csv,text/csv" hidden onChange={handleBulkFileChange}/>
          <Button onClick={()=>{setShowCreateForm(open=>!open);setFormError("");}}>{showCreateForm?"Close Form":"+ Add New Product"}</Button>
        </div>
        {(bulkFile||bulkError||bulkRows.length>0)&&<Card className="product-list-page__bulk-card">
          <strong>Bulk Product Catalogue Import</strong>
          <p>Product Manufacturer List CSV. Existing Product Codes are skipped; no warehouse stock is created.</p>
          {bulkFile&&<p>{bulkFile.name}</p>}{bulkRows.length>0&&<p>{bulkRows.length.toLocaleString("en-IN")} rows ready to import.</p>}
          {bulkError&&<div className="product-list-page__form-error" role="alert">{bulkError}</div>}
          <div className="product-list-page__form-actions">
            <Button type="button" variant="secondary" disabled={bulkBusy} onClick={()=>{setBulkFile(null);setBulkRows([]);setBulkError("");const input=document.getElementById("product-catalogue-csv");if(input)input.value="";}}>Cancel</Button>
            <Button type="button" disabled={!bulkRows.length||bulkBusy} onClick={handleBulkImport}>{bulkBusy?"Importing…":`Import ${bulkRows.length.toLocaleString("en-IN")} Products`}</Button>
          </div>
        </Card>}
      </>)}
      
      {formSuccess && <div className="product-list-page__success" role="status">{formSuccess}</div>}
      {formError && !showCreateForm && <div className="product-list-page__form-error" role="alert">{formError}</div>}

      {showCreateForm && canCreate && (
        <PageSection title="Register a New Product" subtitle="Register a product the business may deal in. This creates a catalogue record only, not warehouse stock.">
          <Card className="product-list-page__create-card">
            <form onSubmit={handleCreateProduct}>
              <div className="product-list-page__form-grid">
                <Input label="Product Code" name="productCode" value={formData.productCode} onChange={handleFormChange} placeholder="Unique product code" maxLength={64} required />
                <Input label="Product Name" name="name" value={formData.name} onChange={handleFormChange} placeholder="Full product name" maxLength={200} required />
                <Input label="Nickname" name="nick" value={formData.nick} onChange={handleFormChange} placeholder="Optional short name" maxLength={120} />
                <Input label="Manufacturer / Division" name="manufacturerDivision" value={formData.manufacturerDivision} onChange={handleFormChange} placeholder="Manufacturer or division" maxLength={200} />
                <Input label="Product Type" name="productType" value={formData.productType} onChange={handleFormChange} placeholder="e.g. Tablet, Syrup, Surgical" maxLength={100} />
                <Input label="HSN Code" name="hsnCode" value={formData.hsnCode} onChange={handleFormChange} placeholder="HSN code" maxLength={32} />
                <Input label="IGST Rate (%)" name="igstRate" type="number" min="0" max="100" step="0.01" value={formData.igstRate} onChange={handleFormChange} placeholder="Optional" />
                <Input label="CGST Rate (%)" name="cgstRate" type="number" min="0" max="100" step="0.01" value={formData.cgstRate} onChange={handleFormChange} placeholder="Optional" />
                <Input label="SGST Rate (%)" name="sgstRate" type="number" min="0" max="100" step="0.01" value={formData.sgstRate} onChange={handleFormChange} placeholder="Optional" />
              </div>
              <p className="product-list-page__form-note">Product Code and Product Name are required. Tax details can remain blank until confirmed. Stock, batch, expiry and purchase price are intentionally excluded.</p>
              {formError && <div className="product-list-page__form-error" role="alert">{formError}</div>}
              <div className="product-list-page__form-actions">
                <Button type="button" variant="secondary" disabled={saving} onClick={() => { setShowCreateForm(false); setFormError(""); }}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save to Product Catalogue"}</Button>
              </div>
            </form>
          </Card>
        </PageSection>
      )}

      <div className="product-list-page__metrics">
        <KPICard
          title="Products Listed"
          value={loading ? "—" : products.length.toLocaleString("en-IN")}
          subtitle="Approved catalogue records"
          accent="brand"
          variant="compact"
          loading={loading}
        />
        <KPICard
          title="Manufacturers / Divisions"
          value={loading ? "—" : manufacturers.length.toLocaleString("en-IN")}
          subtitle="Distinct catalogue entries"
          accent="blue"
          variant="compact"
          loading={loading}
        />
        <KPICard
          title="Product Types"
          value={loading ? "—" : productTypes.length.toLocaleString("en-IN")}
          subtitle={loading ? "Loading catalogue" : `${classifiedCount.toLocaleString("en-IN")} products classified`}
          accent="green"
          variant="compact"
          loading={loading}
        />
        <KPICard
          title="Missing HSN"
          value={loading ? "—" : missingHsnCount.toLocaleString("en-IN")}
          subtitle="Records requiring HSN review"
          accent={missingHsnCount ? "orange" : "green"}
          variant="compact"
          loading={loading}
        />
      </div>

      <PageSection
        title="Product Catalogue"
        subtitle={loading ? "Loading product records…" : `${filteredProducts.length.toLocaleString("en-IN")} of ${products.length.toLocaleString("en-IN")} products`}
      >
        {error ? (
          <Card className="product-list-page__error">
            <div role="alert">{error}</div>
          </Card>
        ) : loading ? (
          <LoadingSpinner label="Loading product catalogue…" />
        ) : (
          <>
            <Card className="product-list-page__filter-card" padding="compact">
              <div className="product-list-page__filters">
                <Input
                  label="Search catalogue"
                  type="search"
                  placeholder="Product code, name, nickname, manufacturer or HSN"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
                <Select
                  label="Product type"
                  value={typeFilter}
                  onChange={(event) => setTypeFilter(event.target.value)}
                >
                  <option value="All">All types</option>
                  {productTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Select>
                <Select
                  label="Manufacturer / Division"
                  value={manufacturerFilter}
                  onChange={(event) => setManufacturerFilter(event.target.value)}
                >
                  <option value="All">All manufacturers</option>
                  {manufacturers.map((manufacturer) => (
                    <option key={manufacturer} value={manufacturer}>{manufacturer}</option>
                  ))}
                </Select>
              </div>
            </Card>

            {filteredProducts.length === 0 ? (
              <EmptyState
                icon="📋"
                title={products.length ? "No matching products" : "Product catalogue is empty"}
                description={
                  products.length
                    ? "Try changing your search or filters."
                    : "The catalogue collection is ready. Product records will appear after the approved catalogue import."
                }
              />
            ) : (
              <div className="product-list-page__table-card">
                <DataTable>
                  <thead>
                    <tr>
                      <th>Product Code</th>
                      <th>Product Name</th>
                      <th>Nickname</th>
                      <th>Manufacturer / Division</th>
                      <th>Type</th>
                      <th>HSN Code</th>
                      <th>GST</th>
                      <th>Record</th>
                      {canDelete && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product._id || product.productCode}>
                        <td className="product-list-page__code">{displayValue(product.productCode)}</td>
                        <td className="product-list-page__name">{displayValue(product.name)}</td>
                        <td>{displayValue(product.nick)}</td>
                        <td>{displayValue(product.manufacturerDivision)}</td>
                        <td>{displayValue(product.productType)}</td>
                        <td className="product-list-page__code">{displayValue(product.hsnCode)}</td>
                        <td className="product-list-page__tax">
                          <span>IGST: {displayValue(product.igstRate)}%</span>
                          <span>CGST: {displayValue(product.cgstRate)}%</span>
                          <span>SGST: {displayValue(product.sgstRate)}%</span>
                        </td>
                        <td><StatusBadge variant="success">Listed</StatusBadge></td>
                        {canDelete && (
                          <td className="product-list-page__actions-cell">
                            <Button
                              type="button"
                              variant="danger"
                              size="sm"
                              disabled={deletingProductId === product._id}
                              onClick={() => handleDeleteProduct(product)}
                              aria-label={`Delete ${product.name}`}
                            >
                              {deletingProductId === product._id ? "Deleting…" : "Delete"}
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </DataTable>
              </div>
            )}
          </>
        )}
      </PageSection>
    </div>
  );
}

export default ProductList;
