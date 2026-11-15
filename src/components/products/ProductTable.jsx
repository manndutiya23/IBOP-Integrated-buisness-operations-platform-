import { DataTable, StatusBadge } from "../Ui";
import "./ProductTable.css";

function ProductTable({ products }) {
  const getStatus = (stockValue) => {
    const stock = Number(stockValue || 0);
    if (stock <= 0) return { variant: "danger", label: "No stock" };
    if (stock <= 10) return { variant: "warning", label: "Low stock" };
    return { variant: "success", label: "In stock" };
  };

  return (
    <div className="product-table">
      <DataTable>
        <thead>
          <tr>
            <th>Product Code</th>
            <th>Product</th>
            <th>Nickname</th>
            <th>Manufacturer / Division</th>
            <th>Type</th>
            <th>HSN</th>
            <th>GST Rates</th>
            <th>Available Stock</th>
            <th>Stock Status</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="9" className="datatable__empty">No catalogue products match these filters.</td>
            </tr>
          ) : products.map((product) => {
            const status = getStatus(product.stock);
            return (
              <tr key={product._id || product.id || product.productCode}>
                <td className="product-table__code">{product.productCode || "—"}</td>
                <td>
                  <strong>{product.name || "Unnamed product"}</strong>
                  {product.batchNumber && <small className="product-table__meta">Latest batch: {product.batchNumber}</small>}
                </td>
                <td>{product.nick || "—"}</td>
                <td>{product.manufacturerDivision || "—"}</td>
                <td>{product.productType || "—"}</td>
                <td>{product.hsnCode || "—"}</td>
                <td className="product-table__tax">
                  <span>IGST {product.igstRate ?? "—"}%</span>
                  <span>CGST {product.cgstRate ?? "—"}%</span>
                  <span>SGST {product.sgstRate ?? "—"}%</span>
                </td>
                <td>{Number(product.stock || 0).toLocaleString("en-IN")}</td>
                <td><StatusBadge variant={status.variant}>{status.label}</StatusBadge></td>
              </tr>
            );
          })}
        </tbody>
      </DataTable>
    </div>
  );
}

export default ProductTable;
