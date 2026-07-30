import "./DashboardKPIs.css";

const DashboardKPIs = ({
  totalProducts,
  totalSales,
  totalRevenue,
  lowStockProducts,
}) => {
  const cards = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      change: "+12.5%",
      type: "success",
      icon: "💰",
    },
    {
      title: "Orders Today",
      value: totalSales,
      change: "+8.3%",
      type: "success",
      icon: "🛒",
    },
    {
      title: "Low Stock",
      value: lowStockProducts.length,
      change: "View",
      type: "warning",
      icon: "📦",
    },
    {
      title: "Products",
      value: totalProducts,
      change: "Inventory",
      type: "info",
      icon: "🏷️",
    },
    {
      title: "Outstanding",
      value: "₹1.24L",
      change: "Finance",
      type: "danger",
      icon: "💳",
    },
    {
      title: "Employees",
      value: "24",
      change: "HR",
      type: "neutral",
      icon: "👥",
    },
  ];

  return (
    <section className="dashboard-kpis">

      {cards.map((card, index) => (

        <div
          key={index}
          className={`dashboard-kpi dashboard-kpi--${card.type}`}
        >

          <div className="dashboard-kpi__icon">
            {card.icon}
          </div>

          <div className="dashboard-kpi__content">

            <p className="dashboard-kpi__title">
              {card.title}
            </p>

            <h3 className="dashboard-kpi__value">
              {card.value}
            </h3>

            <span className="dashboard-kpi__change">
              {card.change}
            </span>

          </div>

        </div>

      ))}

    </section>
  );
};

export default DashboardKPIs;