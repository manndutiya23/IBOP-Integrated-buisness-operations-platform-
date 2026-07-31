import "./DashboardNotifications.css";
import { useBusinessData } from "../../context/BusinessDataContext";

const DashboardNotifications = () => {
  const {
    lowStockProducts = [],
    totalSales,
    totalRevenue,
  } = useBusinessData();

  const notifications = [];

  if (lowStockProducts.length > 0) {
    notifications.push({
      type: "warning",
      title: "Low Stock Alert",
      description: `${lowStockProducts.length} product(s) require restocking.`,
    });
  }

  notifications.push({
    type: "info",
    title: "Sales Overview",
    description: `${totalSales} sales recorded in the system.`,
  });

  notifications.push({
    type: "success",
    title: "Revenue Updated",
    description: `Current revenue ₹${totalRevenue.toLocaleString()}.`,
  });

  if (notifications.length === 0) {
    notifications.push({
      type: "success",
      title: "Everything Looks Good",
      description: "No notifications at the moment.",
    });
  }

  return (
    <section className="dashboard-notifications">

      <div className="dashboard-notifications__header">

        <div>

          <p className="dashboard-section-label">
            Notifications
          </p>

          <h2 className="dashboard-section-title">
            System Alerts
          </h2>

        </div>

      </div>

      <div className="dashboard-notifications__list">

        {notifications.map((item, index) => (

          <div
            key={index}
            className={`dashboard-notification dashboard-notification--${item.type}`}
          >

            <div className="dashboard-notification__icon">

              {item.type === "warning" && "⚠"}

              {item.type === "success" && "✓"}

              {item.type === "info" && "ℹ"}

            </div>

            <div>

              <h4>{item.title}</h4>

              <p>{item.description}</p>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
};

export default DashboardNotifications;