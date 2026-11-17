import { useEffect, useMemo, useState } from "react";
import { Button, Card, DataTable, KPICard, LoadingSpinner, PageHeader, SectionHeader } from "../components/Ui";
import API from "../utils/axiosConfig";
import "./ManufacturerList.css";

const parseCsv = (text) => {
  const rows = []; let row = []; let value = ""; let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === '"') {
      if (quoted && text[i + 1] === '"') { value += '"'; i += 1; }
      else quoted = !quoted;
    } else if (ch === "," && !quoted) { row.push(value); value = ""; }
    else if ((ch === "\n" || ch === "\r") && !quoted) {
      if (ch === "\r" && text[i + 1] === "\n") i += 1;
      row.push(value); value = "";
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
    } else value += ch;
  }
  row.push(value);
  if (row.some((cell) => cell.trim())) rows.push(row);
  return rows;
};
const normalizeHeader = (value) => value.replace(/^\uFEFF/, "").trim().toLowerCase().replace(/\s+/g, " ");
const display = (value) => value === null || value === undefined || value === "" ? "—" : value;

function ManufacturerList() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [importError, setImportError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [savingSupplier, setSavingSupplier] = useState(false);
  const [supplierForm, setSupplierForm] = useState({ cCode: "", ledgerAccount: "", city: "", area: "", state: "", pinCode: "", email: "", gstin: "", contactPerson: "", telephone: "", mobile: "", status: "SUPP" });

  const loadRecords = async () => {
    try {
      setLoading(true); setError("");
      const response = await API.get("/manufacturers");
      setRecords(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load manufacturer list.");
    } finally { setLoading(false); }
  };
  useEffect(() => { loadRecords(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return records;
    return records.filter((item) => [item.cCode, item.ledgerAccount, item.city, item.area, item.state, item.pinCode, item.email, item.gstin, item.contactPerson, item.mobile, item.telephone].some((v) => String(v || "").toLowerCase().includes(q)));
  }, [records, search]);

  const handleFile = async (event) => {
    const selected = event.target.files?.[0] || null;
    setFile(selected); setPreview([]); setNotice(""); setImportError("");
    if (!selected) return;
    if (!selected.name.toLowerCase().endsWith(".csv")) { setImportError("Please select the Manufacturer List CSV file."); return; }
    try {
      const rows = parseCsv((await selected.text()).replace(/^\uFEFF/, ""));
      if (rows.length < 2) throw new Error("CSV must contain headers and at least one record.");
      const headers = rows[0].map(normalizeHeader);
      const columns = {
        cCode: "ccode", ledgerAccount: "ledger account", city: "city", area: "area",
        add1: "add1", add2: "add2", state: "state", status: "status",
        pinCode: "pincode", email: "email", gstin: "gstin", gstDate: "gstdate",
        salesman: "salesman", cdPercent: "cd%", contactPerson: "contact person",
        telephone: "telephone", mobile: "mobile", sms: "sms",
      };
      const indexes = Object.fromEntries(Object.entries(columns).map(([key, header]) => [key, headers.indexOf(header)]));
      const missing = ["cCode", "ledgerAccount"].filter((key) => indexes[key] < 0);
      if (missing.length) throw new Error("Required CSV columns missing: " + missing.join(", "));
      const parsed = rows.slice(1).map((cells) => Object.fromEntries(Object.entries(indexes).map(([key, index]) => [key, index < 0 ? "" : String(cells[index] ?? "").trim()])));
      setPreview(parsed);
    } catch (err) { setImportError(err.message || "Could not read this CSV."); }
  };

  const addSupplier = async (event) => { event.preventDefault(); setSavingSupplier(true); setImportError(""); setNotice(""); try { await API.post("/manufacturers", supplierForm); setSupplierForm({ cCode: "", ledgerAccount: "", city: "", area: "", state: "", pinCode: "", email: "", gstin: "", contactPerson: "", telephone: "", mobile: "", status: "SUPP" }); setShowAddForm(false); setNotice("Supplier added to Manufacturer List."); await loadRecords(); } catch (err) { setImportError(err.response?.data?.message || "Unable to add supplier."); } finally { setSavingSupplier(false); } };

  const removeSupplier = async (supplier) => { if (!window.confirm("Delete supplier " + supplier.ledgerAccount + "? Suppliers linked to purchase invoices cannot be deleted.")) return; try { await API.delete("/manufacturers/" + supplier._id); setNotice("Supplier deleted."); await loadRecords(); } catch (err) { setImportError(err.response?.data?.message || "Unable to delete supplier."); } };

  const importFile = async () => {
    if (!preview.length) return;
    setBusy(true); setImportError(""); setNotice("");
    try {
      const response = await API.post("/manufacturers/bulk-import", { manufacturers: preview });
      const result = response.data;
      setNotice(`Import complete: ${result.imported} added, ${result.skippedExisting} already existed, ${result.duplicatesInFile} duplicate rows skipped, ${result.invalid} invalid rows.`);
      setPreview([]); setFile(null);
      const input = document.getElementById("manufacturer-csv");
      if (input) input.value = "";
      await loadRecords();
    } catch (err) { setImportError(err.response?.data?.message || "Manufacturer import failed."); }
    finally { setBusy(false); }
  };

  return <div className="manufacturer-page">
    <PageHeader eyebrow="Supply Chain" title="Manufacturer List" subtitle="Centralised supplier and manufacturer contact directory imported from the current working master file." />
    <div className="manufacturer-kpis">
      <KPICard title="Total records" value={records.length.toLocaleString("en-IN")} subtitle="Manufacturer / supplier entries" />
      <KPICard title="States covered" value={new Set(records.map((r) => r.state).filter(Boolean)).size} subtitle="Distinct states in the list" />
      <KPICard title="With GSTIN" value={records.filter((r) => r.gstin).length.toLocaleString("en-IN")} subtitle="Records containing GST registration" />
      <KPICard title="With email" value={records.filter((r) => r.email).length.toLocaleString("en-IN")} subtitle="Records containing email contact" />
    </div>

    <Card>
      <SectionHeader title="Manage Suppliers" subtitle="Add a supplier manually or remove an unused supplier record." />
      <div className="manufacturer-manage-actions"><Button onClick={() => setShowAddForm((value) => !value)} variant="secondary">{showAddForm ? "Close form" : "Add supplier"}</Button></div>
      {showAddForm && <form className="manufacturer-add-form" onSubmit={addSupplier}>{[["cCode","CCode *"],["ledgerAccount","Supplier / Ledger Name *"],["city","City"],["area","Area"],["state","State"],["pinCode","PIN Code"],["email","Email"],["gstin","GSTIN"],["contactPerson","Contact Person"],["telephone","Telephone"],["mobile","Mobile"],["status","Status"]].map(([key,label]) => <label key={key}>{label}<input required={key === "cCode" || key === "ledgerAccount"} value={supplierForm[key]} onChange={(e) => setSupplierForm((current) => ({ ...current, [key]: e.target.value }))} /></label>)}<div className="manufacturer-form-actions"><Button type="submit" disabled={savingSupplier}>{savingSupplier ? "Saving…" : "Save supplier"}</Button></div></form>}
    </Card>

    <Card>
      <SectionHeader title="Import Manufacturer List" subtitle="Upload the current CSV. Existing CCode + Ledger Account combinations are skipped; no product or inventory records are created." />
      <div className="manufacturer-import">
        <input id="manufacturer-csv" type="file" accept=".csv,text/csv" onChange={handleFile} />
        {file && <span className="manufacturer-file-name">{file.name} · {preview.length.toLocaleString("en-IN")} rows ready</span>}
        <Button onClick={importFile} disabled={!preview.length || busy}>{busy ? "Importing…" : "Import records"}</Button>
      </div>
      <p className="manufacturer-note">This source currently contains 672 rows. CCode is not unique in the file, so records are identified by the combination of CCode and Ledger Account. Blank optional fields are preserved as empty values; phone and PIN fields are kept as text.</p>
      {importError && <p className="manufacturer-error">{importError}</p>}
      {notice && <p className="manufacturer-success">{notice}</p>}
      {preview.length > 0 && <div className="manufacturer-preview"><strong>Import preview</strong><DataTable><thead><tr><th>CCode</th><th>Ledger Account</th><th>City</th><th>State</th><th>GSTIN</th><th>Mobile</th></tr></thead><tbody>{preview.slice(0, 5).map((r, i) => <tr key={i}><td>{display(r.cCode)}</td><td>{display(r.ledgerAccount)}</td><td>{display(r.city)}</td><td>{display(r.state)}</td><td>{display(r.gstin)}</td><td>{display(r.mobile)}</td></tr>)}</tbody></DataTable></div>}
    </Card>

    <Card>
      <SectionHeader title="Manufacturer Directory" subtitle="Search supplier identity, location, GST and contact details." />
      <div className="manufacturer-search"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, CCode, city, GSTIN, contact, mobile…" /><span>{filtered.length.toLocaleString("en-IN")} records</span></div>
      {loading ? <LoadingSpinner /> : error ? <p className="manufacturer-error">{error}</p> : filtered.length === 0 ? <p className="manufacturer-empty">No manufacturer records found.</p> :
        <div className="manufacturer-table-wrap"><DataTable><thead><tr><th>CCode</th><th>Ledger Account</th><th>City / Area</th><th>State</th><th>PIN</th><th>GSTIN</th><th>Email</th><th>Contact Person</th><th>Telephone / Mobile</th><th>Status</th><th>Actions</th></tr></thead><tbody>
          {filtered.map((item) => <tr key={item._id}><td>{display(item.cCode)}</td><td className="manufacturer-name">{display(item.ledgerAccount)}</td><td>{[item.city, item.area].filter(Boolean).join(" / ") || "—"}</td><td>{display(item.state)}</td><td>{display(item.pinCode)}</td><td>{display(item.gstin)}</td><td>{display(item.email)}</td><td>{display(item.contactPerson)}</td><td>{[item.telephone, item.mobile].filter(Boolean).join(" / ") || "—"}</td><td>{display(item.status)}</td><td><Button size="sm" variant="danger" onClick={() => removeSupplier(item)}>Delete</Button></td></tr>)}
        </tbody></DataTable></div>}
    </Card>
  </div>;
}
export default ManufacturerList;
