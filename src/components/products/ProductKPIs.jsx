import "./ProductKPIs.css";
import { KPICard } from "../Ui";

function ProductKPIs({ products }) {
  const totalProducts = products.length;
  const stockedProducts = products.filter((product) => Number(product.stock || 0) > 0).length;
  const unclassifiedProducts = products.filter((product) => !product.productType).length;
  const missingHsn = products.filter((product) => !product.hsnCode).length;

  return (
    <div className="product-kpis">
      <KPICard title="Catalogue Products" value={totalProducts.toLocaleString("en-IN")} subtitle="Registered product master records" accent="brand" />
      <KPICard title="Products in Stock" value={stockedProducts.toLocaleString("en-IN")} subtitle="Catalogue items with available stock" accent="success" />
      <KPICard title="Missing Product Type" value={unclassifiedProducts.toLocaleString("en-IN")} subtitle="Records needing classification" accent="warning" />
      <KPICard title="Missing HSN" value={missingHsn.toLocaleString("en-IN")} subtitle="Records needing HSN review" accent="danger" />
    </div>
  );
}

export default ProductKPIs;
