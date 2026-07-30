import "./DashboardAnalytics.css";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import { useBusinessData } from "../../context/BusinessDataContext";

const DashboardAnalytics = () => {
  const {
    sales,
    totalRevenue,
    lowStockProducts,
  } = useBusinessData();

  const monthlyDataMap = {};

  sales.forEach((sale) => {
    const date = new Date(sale.date);

    const month = date.toLocaleString("default", {
      month: "short",
    });

    if (!monthlyDataMap[month]) {
      monthlyDataMap[month] = {
        month,
        revenue: 0,
        sales: 0,
      };
    }

    monthlyDataMap[month].revenue += sale.finalAmount || 0;
    monthlyDataMap[month].sales += 1;
  });

  const chartData = Object.values(monthlyDataMap);

  return (
    <section className="dashboard-analytics">

      <div className="dashboard-analytics__header">

        <div>

          <p className="dashboard-section-label">
            Analytics
          </p>

          <h2 className="dashboard-section-title">
            Revenue Trends
          </h2>

        </div>

        <div className="dashboard-revenue">

          <span>Total Revenue</span>

          <h3>
            ₹{totalRevenue.toLocaleString()}
          </h3>

        </div>

      </div>

      <div className="dashboard-chart">

        <ResponsiveContainer
          width="100%"
          height={320}
        >

          <LineChart data={chartData}>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#ECEFF4"
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
            />

            <Tooltip />

            <Legend />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#8C1D40"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

      <div className="dashboard-low-stock">

        <div className="dashboard-low-stock__header">

          <h3>
            Low Stock Products
          </h3>

          <span>
            {lowStockProducts.length} Items
          </span>

        </div>
                {lowStockProducts.length === 0 ? (

          <div className="dashboard-empty-state">

            <div className="dashboard-empty-icon">
              ✓
            </div>

            <p>
              Inventory levels are healthy.
            </p>

          </div>

        ) : (

          <div className="dashboard-low-stock__list">

            {lowStockProducts
              .slice(0, 5)
              .map((product) => (

                <div
                  key={product._id}
                  className="dashboard-low-stock__item"
                >

                  <div>

                    <h4>
                      {product.name}
                    </h4>

                    <p>
                      Current Stock
                    </p>

                  </div>

                  <span className="dashboard-stock-badge">

                    {product.stock}

                  </span>

                </div>

              ))}

          </div>

        )}

      </div>

    </section>
  );
};

export default DashboardAnalytics;