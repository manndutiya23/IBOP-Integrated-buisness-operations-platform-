import { KPICard } from "../Ui";
import "./PurchaseKPIs.css";

function PurchaseKPIs({

    totalPurchases,

    totalSpend,

    supplierCount,

    averageOrderValue,

}) {

    return (

        <section className="purchase-kpis">

            <KPICard

                title="Purchases"

                value={totalPurchases}

                subtitle="Total purchase orders"

            />

            <KPICard

                title="Procurement Cost"

                value={`₹${totalSpend.toLocaleString()}`}

                subtitle="Total purchasing spend"

            />

            <KPICard

                title="Suppliers"

                value={supplierCount}

                subtitle="Active suppliers"

            />

            <KPICard

                title="Avg Order Value"

                value={`₹${averageOrderValue.toFixed(2)}`}

                subtitle="Average purchase value"

            />

        </section>

    );

}

export default PurchaseKPIs;