import "./ProductKPIs.css";
import { KPICard } from "../Ui";

function ProductKPIs({ products }) {
    const totalProducts = products.length;

    const inventoryValue = products.reduce(
        (sum, product) =>
            sum + Number(product.price || 0) * Number(product.stock || 0),
        0
    );

    const lowStock = products.filter(
        (product) => Number(product.stock) <= 10
    ).length;

    const expiringSoon = products.filter((product) => {
        if (!product.expiryDate) return false;

        const expiry = new Date(product.expiryDate);
        const today = new Date();

        const diff =
            (expiry - today) / (1000 * 60 * 60 * 24);

        return diff >= 0 && diff <= 30;
    }).length;

    const formatCurrency = (value) => {
        if (value >= 10000000)
            return `₹${(value / 10000000).toFixed(1)}Cr`;

        if (value >= 100000)
            return `₹${(value / 100000).toFixed(1)}L`;

        if (value >= 1000)
            return `₹${(value / 1000).toFixed(1)}K`;

        return `₹${value.toLocaleString()}`;
    };

    return (
        <div className="product-kpis">

            <KPICard
                title="Products"
                value={totalProducts}
                subtitle="Registered inventory items"
                accent="brand"
            />

            <KPICard
                title="Inventory Value"
                value={formatCurrency(inventoryValue)}
                subtitle="Current stock valuation"
                accent="success"
            />

            <KPICard
                title="Low Stock"
                value={lowStock}
                subtitle="Items below threshold"
                accent="warning"
            />

            <KPICard
                title="Expiring Soon"
                value={expiringSoon}
                subtitle="Within next 30 days"
                accent="danger"
            />

        </div>
    );
}

export default ProductKPIs;