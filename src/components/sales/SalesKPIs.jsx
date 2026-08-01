import { KPICard } from "../Ui";
import "./SalesKPIs.css";

function SalesKPIs({ sales }) {

    const totalSales = sales.length;

    const totalRevenue = sales.reduce(
        (sum, sale) =>
            sum + Number(sale.finalAmount || 0),
        0
    );

    const averageOrder = totalSales
        ? totalRevenue / totalSales
        : 0;

    const today = new Date().toDateString();

    const todaySales = sales.filter((sale) => {

        if (!sale.date) return false;

        return (
            new Date(sale.date).toDateString() === today
        );

    }).length;

    return (

        <section className="sales-kpis">

            <KPICard
                title="Total Sales"
                value={totalSales}
                subtitle="Orders completed"
            />

            <KPICard
                title="Revenue"
                value={`₹${totalRevenue.toLocaleString()}`}
                subtitle="Total earnings"
            />

            <KPICard
                title="Average Order"
                value={`₹${averageOrder.toFixed(2)}`}
                subtitle="Per sale"
            />

            <KPICard
                title="Today's Sales"
                value={todaySales}
                subtitle="Orders today"
            />

        </section>

    );

}

export default SalesKPIs;