import "./DashboardHeader.css";

const DashboardHeader = ({ user }) => {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="dashboard-header">

      <div className="dashboard-header__left">

        <p className="dashboard-header__eyebrow">
          Dashboard
        </p>

        <h1 className="dashboard-header__title">
          Good Morning, {user?.name || "Administrator"} 👋
        </h1>

        <p className="dashboard-header__subtitle">
          Monitor sales, finance, inventory and workforce activity from one
          centralized operational dashboard.
        </p>

      </div>

      <div className="dashboard-header__right">

        <div className="dashboard-search">

          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
              stroke="currentColor"
              strokeWidth="2"
            />

            <line
              x1="20"
              y1="20"
              x2="16.6"
              y2="16.6"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>

          <input
            type="text"
            placeholder="Search anything..."
          />

          <span className="search-shortcut">
            Ctrl + K
          </span>

        </div>

        <button className="dashboard-date">
          📅 {today}
        </button>

      </div>

    </header>
  );
};

export default DashboardHeader;