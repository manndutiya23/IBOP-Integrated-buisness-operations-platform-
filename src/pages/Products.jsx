import { useState } from "react";
import { useBusinessData } from "../context/BusinessDataContext";
import { useAuth } from "../context/AuthContext";
import { PageHeader, PageSection } from "../components/Ui";
import { ProductKPIs, ProductToolbar, ProductTable } from "../components/products";

function Products() {
  const { products } = useBusinessData();
  const { user } = useAuth();
  const role = user?.role;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesStatus = true;
    if (statusFilter === "In Stock") matchesStatus = product.stock > 10;
    else if (statusFilter === "Low Stock") matchesStatus = product.stock > 0 && product.stock <= 10;
    else if (statusFilter === "Out of Stock") matchesStatus = product.stock === 0;
    return matchesSearch && matchesStatus;
  });

  return <>
    <PageHeader eyebrow="Inventory" title="Products" subtitle="View medicine, device and consumable batches currently held in the warehouse." />
    <ProductKPIs products={products} />
    <PageSection title="Inventory" subtitle="Stock enters through verified goods receipts. Corrections require an auditable adjustment with a reason.">
      <ProductToolbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
      <ProductTable products={filteredProducts} role={role} />
    </PageSection>
  </>;
}
export default Products;
