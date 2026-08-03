import { KPICard } from "../Ui";
import "./FinanceKPIs.css";

function FinanceKPIs({

    totalRevenue,

    totalExpenses,

    profit,

    pendingPayments,

    totalGSTCollected,

    averageInvoiceValue,

    totalProcurementSpend,

    topSupplier,

}) {

    return (

        <section className="finance-kpis">

            <KPICard
                title="Revenue"
                value={`₹${totalRevenue.toLocaleString()}`}
                subtitle="Total revenue"
            />

            <KPICard
                title="Expenses"
                value={`₹${totalExpenses.toLocaleString()}`}
                subtitle="Business expenses"
            />

            <KPICard
                title="Profit"
                value={`₹${profit.toLocaleString()}`}
                subtitle="Net profit"
            />

            <KPICard
                title="Pending Payments"
                value={`₹${pendingPayments.toLocaleString()}`}
                subtitle="Outstanding invoices"
            />

            <KPICard
                title="GST Collected"
                value={`₹${totalGSTCollected.toLocaleString()}`}
                subtitle="Tax collected"
            />

            <KPICard
                title="Avg Invoice"
                value={`₹${averageInvoiceValue.toFixed(2)}`}
                subtitle="Average invoice value"
            />

            <KPICard
                title="Procurement"
                value={`₹${totalProcurementSpend.toLocaleString()}`}
                subtitle="Purchasing spend"
            />

            <KPICard
                title="Top Supplier"
                value={topSupplier}
                subtitle="Highest procurement"
            />

        </section>

    );

}

export default FinanceKPIs;