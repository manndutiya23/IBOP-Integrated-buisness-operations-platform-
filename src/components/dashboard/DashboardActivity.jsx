import "./DashboardActivity.css";
import { useBusinessData } from "../../context/BusinessDataContext";

const DashboardActivity = () => {
  const { sales = [], lowStockProducts = [] } = useBusinessData();

  const activities = [
    {
      title: "Sales Recorded",
      value: `${sales.length} total sales`,
      status: "success",
    },
    {
      title: "Low Stock Products",
      value: `${lowStockProducts.length} products need attention`,
      status: lowStockProducts.length ? "warning" : "success",
    },
    {
      title: "Revenue Updated",
      value: "Latest revenue metrics calculated",
      status: "info",
    },
    {
      title: "System Status",
      value: "All services operational",
      status: "success",
    },
  ];

  const getBadge = (status) => {
    switch (status) {
      case "success":
        return "✓";
      case "warning":
        return "!";
      case "danger":
        return "✕";
      default:
        return "•";
    }
  };

  return (
    <section className="dashboard-activity">

      <div className="dashboard-activity__header">

        <div>
          <p className="dashboard-section-label">
            Activity
          </p>

          <h2 className="dashboard-section-title">
            Recent Updates
          </h2>
        </div>

      </div>

      <div className="dashboard-activity__list">

        {activities.map((item, index) => (

          <div
            key={index}
            className="dashboard-activity__item"
          >

            <div className={`dashboard-activity__badge dashboard-activity__badge--${item.status}`}>
              {getBadge(item.status)}
            </div>

            <div className="dashboard-activity__content">

              <h4>{item.title}</h4>

              <p>{item.value}</p>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
};

export default DashboardActivity;