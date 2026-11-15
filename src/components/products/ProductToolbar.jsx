import "./ProductToolbar.css";
import { Button, Input, Select } from "../Ui";

function ProductToolbar({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  productTypes,
  statusFilter,
  setStatusFilter,
  onAddProduct,
  onImport,
  canManage,
  canImport,
}) {
  return (
    <div className="product-toolbar">
      <div className="product-toolbar__left">
        <Input
          aria-label="Search product catalogue"
          placeholder="Search code, name, nickname, manufacturer or HSN..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <Select aria-label="Filter by product type" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
          <option value="All">All Types</option>
          {productTypes.map((type) => <option key={type} value={type}>{type}</option>)}
        </Select>
        <Select aria-label="Filter by stock status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="All">All Stock Status</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </Select>
      </div>
      <div className="product-toolbar__right">
        {canImport && <Button variant="secondary" onClick={onImport}>Import CSV</Button>}
        {canManage && <Button onClick={onAddProduct}>+ Add Product</Button>}
      </div>
    </div>
  );
}

export default ProductToolbar;
