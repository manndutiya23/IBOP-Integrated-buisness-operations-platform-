import { useState } from "react";
import { Button, DataTable } from "../Ui";
import "./PurchaseTable.css";
function PurchaseTable({ purchases, onReceive, onDelete }) {
  const [drafts, setDrafts] = useState({});
  const [activeId, setActiveId] = useState(null);
  const update = (key, field, value) => setDrafts((current) => ({ ...current, [key]: { ...current[key], [field]: value } }));
  return <div className="purchase-invoices-list">
    {purchases.length === 0 ? <p className="datatable__empty">No purchase invoices found.</p> : purchases.map((purchase) => {
      const lines = purchase.items || [];
      const isActive = activeId === purchase._id;
      const hasReceipts = (purchase.receipts || []).length > 0 || (purchase.items || []).some((line) => Number(line.receivedQuantity || 0) > 0);
      return <section className="purchase-invoice-card" key={purchase._id}>
        <div className="purchase-invoice-card__header"><div><strong>{purchase.invoiceNumber || "Purchase invoice"}</strong><div>{purchase.supplierName} · {purchase.date ? new Date(purchase.date).toLocaleDateString() : "—"}</div></div><div><strong>₹{Number(purchase.finalAmount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</strong><div className="purchase-invoice-status">{purchase.status || "Pending"}</div></div></div>
        <DataTable><thead><tr><th>Product</th><th>Ordered</th><th>Received</th><th>Outstanding</th><th>Unit price</th></tr></thead><tbody>{lines.map((line) => <tr key={line._id}><td>{line.productCode} — {line.productName}</td><td>{line.quantity}</td><td>{line.receivedQuantity || 0}</td><td>{line.quantity - (line.receivedQuantity || 0)}</td><td>₹{Number(line.purchasePrice).toLocaleString("en-IN")}</td></tr>)}</tbody></DataTable>
        {purchase.status !== "Received" && <div className="purchase-invoice-card__actions"><Button size="sm" variant="secondary" onClick={() => setActiveId(isActive ? null : purchase._id)}>{isActive ? "Close goods receipt" : "Record goods received"}</Button>{!hasReceipts && <Button size="sm" variant="danger" onClick={async () => { if (window.confirm(`Delete purchase invoice ${purchase.invoiceNumber || ""}? This cannot be undone.`)) { try { await onDelete(purchase._id); } catch (error) { window.alert(error.response?.data?.message || "Could not delete purchase invoice."); } } }}>Delete invoice</Button>}</div>}
        {isActive && <div className="purchase-receipt"><p><strong>Physical verification</strong> — enter only the quantities you have personally checked. Unreceived quantities remain outstanding.</p>
          {lines.map((line) => { const remaining = line.quantity - (line.receivedQuantity || 0); if (remaining <= 0) return null; const draft = drafts[line._id] || {}; return <div className="purchase-receipt__line" key={line._id}>
            <label><input type="checkbox" checked={Boolean(draft.checked)} onChange={(e) => update(line._id, "checked", e.target.checked)} /> {line.productCode} — {line.productName} <span>({remaining} outstanding)</span></label>
            {draft.checked && <div className="purchase-form__grid"><div className="ibop-input-group"><label>Actually received</label><input type="number" min="1" max={remaining} step="1" value={draft.quantity || ""} onChange={(e) => update(line._id, "quantity", e.target.value)} required /></div><div className="ibop-input-group"><label>Batch number</label><input value={draft.batchNumber || ""} onChange={(e) => update(line._id, "batchNumber", e.target.value)} /></div><div className="ibop-input-group"><label>Expiry date</label><input type="date" value={draft.expiryDate || ""} onChange={(e) => update(line._id, "expiryDate", e.target.value)} /></div></div>}
          </div>; })}
          <Button size="sm" onClick={async () => { const receiptItems = lines.filter((line) => drafts[line._id]?.checked).map((line) => ({ purchaseItemId: line._id, quantity: Number(drafts[line._id].quantity), batchNumber: drafts[line._id].batchNumber || "", expiryDate: drafts[line._id].expiryDate || null })); if (!receiptItems.length || receiptItems.some((item) => !Number.isSafeInteger(item.quantity) || item.quantity < 1)) return; await onReceive(purchase._id, receiptItems); setDrafts((current) => { const next = { ...current }; lines.forEach((line) => delete next[line._id]); return next; }); setActiveId(null); }}>Confirm verified receipt</Button>
        </div>}
      </section>;
    })}
  </div>;
}
export default PurchaseTable;
