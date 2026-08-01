import "./DashboardTables.css";

import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const DashboardTables = () => {
  const { user } = useAuth();

  const role = user?.role;

  const modules = [
    {
      name: "Sales",
      path: "/sales-module",
      roles: ["Sales", "Management", "Admin"],
      description: "Track customer orders and create new sales.",
      color: "sales",
    },
    {
      name: "Finance",
      path: "/finance-module",
      roles: ["Finance", "Management", "Admin"],
      description: "Invoices, expenses and financial reporting.",
      color: "finance",
    },
    {
      name: "Supply Chain",
      path: "/products",
      roles: ["Supply Chain", "Management", "Admin"],
      description: "Inventory, products and purchasing.",
      color: "supply",
    },
    {
      name: "HR",
      path: "/hr-module",
      roles: ["HR", "Admin"],
      description: "Employees, attendance and recruitment.",
      color: "hr",
    },
  ];

  return (
    <section className="dashboard-modules">

      <div className="dashboard-modules__header">

        <div>

          <p className="dashboard-section-label">
            Workspace
          </p>

          <h2 className="dashboard-section-title">
            Business Modules
          </h2>

        </div>

      </div>

      <div className="dashboard-modules__grid">

        {modules
          .filter((module) => module.roles.includes(role))
          .map((module) => (

            <Link
              key={module.name}
              to={module.path}
              className={`dashboard-module dashboard-module--${module.color}`}
            >

              <div className="dashboard-module__top">

                <div className="dashboard-module__icon">

                  {module.name.charAt(0)}

                </div>

                <span className="dashboard-module__tag">
                  Module
                </span>

              </div>

              <div className="dashboard-module__body">

                <h3>
                  {module.name}
                </h3>

                <p>
                  {module.description}
                </p>

              </div>

              <div className="dashboard-module__footer">

                <span>
                  Open Module
                </span>

                <span>
                  →
                </span>

              </div>

            </Link>

          ))}

      </div>

    </section>
  );
};

export default DashboardTables;