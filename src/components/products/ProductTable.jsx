import { useState } from "react";
import { useBusinessData } from "../../context/BusinessDataContext";
import { Button, DataTable, PageSection, StatusBadge, Input } from "../Ui";
import API from "../../utils/axiosConfig";
import "./ProductTable.css";

function ProductTable({ products }) {
  const { updateProduct, deleteProduct } = useBusinessData();
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState("");

  const savePrice = async (product) => {
    await updateProduct({ _id: product._id, price: Number(editPrice) });
    setEditingId(null);
  };

  const adjustStock = async (product) => {
    const rawChange = window.prompt("Enter stock correction (+ to add, - to remove). This is not a goods receipt.");
    if (rawChange === null) return;
    const quantityChange = Number(rawChange);
    if (!Number.isSafeInteger(quantityChange) || quantityChange === 0) {
      window.alert("Enter a non-zero whole number.");
      return;
    }
    const reason = window.prompt("Why is this stock correction required? (Required, 5–500 characters)");
    if (reason === null) return;
    try {
      const response = await API.post("/products/" + product._id + "/adjust-stock", { quantityChange, reason });
      window.alert("Stock updated: " + response.data.adjustment.previousStock + " → " + response.data.adjustment.newStock);
      window.location.reload();
    } catch (error) {
      window.alert(error.response?.data?.message || "Stock correction failed.");
    }
  };

  const getStatus = (stock) => stock === 0
    ? { variant: "danger", label: "Out of Stock" }
    : stock <= 10 ? { variant: "warning", label: "Low Stock" } : { variant: "success", label: "In Stock" };

  return <PageSection title="Inventory" subtitle="Manage existing warehouse batches. Stock corrections are recorded with an employee and reason.">
    <DataTable>
      <thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Batch</th><th>Expiry</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        {products.length === 0 ? <tr><td colSpan="7" className="datatable__empty">No products found.</td></tr> : products.map((product) => {
          const status = getStatus(Number(product.stock));
          return <tr key={product._id}>
            <td>{product.name}</td>
            <td>{editingId === product._id ? <Input type="number" value={editPrice} onChange={(event) => setEditPrice(event.target.value)} /> : <>₹{Number(product.price).toLocaleString("en-IN")}</>}</td>
            <td>{product.stock}</td>
            <td>{product.batchNumber || "—"}</td>
            <td>{product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : "—"}</td>
            <td><StatusBadge variant={status.variant}>{status.label}</StatusBadge></td>
            <td>{editingId === product._id ? <>
              <Button size="sm" onClick={() => savePrice(product)}>Save price</Button>
              <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>Cancel</Button>
            </> : <>
              <Button size="sm" variant="secondary" onClick={() => { setEditingId(product._id); setEditPrice(String(product.price)); }}>Edit price</Button>
              <Button size="sm" variant="secondary" onClick={() => adjustStock(product)}>Adjust stock</Button>
              <Button size="sm" variant="danger" onClick={() => { if (window.confirm("Delete this inventory batch? This cannot be undone.")) deleteProduct(product._id); }}>Delete</Button>
            </>}</td>
          </tr>;
        })}
      </tbody>
    </DataTable>
  </PageSection>;
}
export default ProductTable;
