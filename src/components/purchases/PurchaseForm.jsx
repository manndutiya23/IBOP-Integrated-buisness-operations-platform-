import { Button, Card, SectionHeader } from "../Ui";
import "./PurchaseForm.css";
function PurchaseForm({ catalogue, suppliers, supplierName, setSupplierName, date, setDate, lines, setLines, handleSubmit, loading }) {
  const addLine = () => setLines((current) => [...current, { productCatalogueId: "", quantity: "1", purchasePrice: "", gst: "0" }]);
  const updateLine = (index, field, value) => setLines((current) => current.map((line, i) => i === index ? { ...line, [field]: value } : line));
  const removeLine = (index) => setLines((current) => current.filter((_, i) => i !== index));
  return <Card>
    <SectionHeader title="Create Purchase Order" subtitle="Choose products from the approved Product List. Creating an order does not change warehouse stock." />
    <form onSubmit={handleSubmit} className="purchase-form">
      <div className="purchase-form__grid">
        <div className="ibop-input-group"><label>Supplier Name</label><select value={supplierName} onChange={(e) => setSupplierName(e.target.value)} required><option value="">Select supplier from Manufacturer List</option>{suppliers.map((supplier) => <option key={supplier._id} value={supplier._id}>{supplier.ledgerAccount}{supplier.city ? ` — ${supplier.city}` : ""}</option>)}</select></div>
        <div className="ibop-input-group"><label>Purchase Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></div>
      </div>
      <div className="purchase-order-lines">
        {lines.map((line, index) => <div className="purchase-order-line" key={index}>
          <div className="ibop-input-group"><label>Product</label><select value={line.productCatalogueId} onChange={(e) => updateLine(index, "productCatalogueId", e.target.value)} required><option value="">Select from Product List</option>{catalogue.map((product) => <option key={product._id} value={product._id}>{product.productCode} — {product.name}</option>)}</select></div>
          <div className="ibop-input-group"><label>Order Quantity</label><input type="number" min="1" step="1" value={line.quantity} onChange={(e) => updateLine(index, "quantity", e.target.value)} required /></div>
          <div className="ibop-input-group"><label>Unit Purchase Price (₹)</label><input type="number" min="0" step="0.01" value={line.purchasePrice} onChange={(e) => updateLine(index, "purchasePrice", e.target.value)} required /></div>
          <div className="ibop-input-group"><label>GST %</label><input type="number" min="0" max="100" step="0.01" value={line.gst} onChange={(e) => updateLine(index, "gst", e.target.value)} /></div>
          <Button type="button" variant="danger" size="sm" onClick={() => removeLine(index)} disabled={lines.length === 1}>Remove</Button>
        </div>)}
      </div>
      <div className="purchase-form__actions"><Button type="button" variant="secondary" onClick={addLine}>Add another product</Button><Button type="submit" disabled={loading || catalogue.length === 0 || suppliers.length === 0}>{loading ? "Creating…" : "Create Purchase Invoice"}</Button></div>
      {catalogue.length === 0 && <p>No products found. Add products to Product List first.</p>}{suppliers.length === 0 && <p>No suppliers found. Add suppliers in Manufacturer List first.</p>}
    </form>
  </Card>;
}
export default PurchaseForm;
