import { useMemo, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { filterNavigationByRole } from "../config/navigation";
import "./AppShell.css";

function AppShell({ user, logout }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const filteredSections = useMemo(() => filterNavigationByRole(user?.role || ""), [user?.role]);

  return (
    <div className="app-shell">
      <aside className={`app-sidebar ${isSidebarOpen ? "is-open" : ""}`}>
        <div className="app-sidebar__brand">
          <div className="app-sidebar__logo">SE</div>
          <div>
            <p className="app-sidebar__eyebrow">Shrinath Enterprises</p>
            <h1 className="app-sidebar__title">IBOP Platform</h1>
          </div>
        </div>

        <nav className="app-sidebar__nav" aria-label="Main navigation">
          {filteredSections.map((section) => (
            <div key={section.title} className="app-sidebar__section">
              <p className="app-sidebar__section-label">{section.title}</p>
              <ul className="app-sidebar__list">
                {section.items.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.path === "/"}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `app-sidebar__link ${isActive ? "is-active" : ""}`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="app-sidebar__footer">
          <p className="app-sidebar__version">IBOP v1.0.0</p>
          <p className="app-sidebar__status">All systems operational</p>
        </div>
      </aside>

      <div
        className={`app-shell__overlay ${isSidebarOpen ? "is-visible" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <div className="app-main">
        <header className="app-topbar">
          <div className="app-topbar__left">
            <button
              type="button"
              className="app-topbar__menu"
              onClick={() => setSidebarOpen((open) => !open)}
              aria-label="Toggle menu"
            >
              ≡
            </button>
            <div>
              <h2 className="app-topbar__greeting">Good morning, {user?.name || user?.username || "Team"}</h2>
              <p className="app-topbar__subtitle">Here is what is happening across your business today.</p>
            </div>
          </div>

          <div className="app-topbar__right">
            <input type="search" className="app-topbar__search" placeholder="Search anything..." />
            <div className="app-topbar__user">
              <span className="app-topbar__avatar">{(user?.name || "U").charAt(0)}</span>
              <div>
                <p className="app-topbar__name">{user?.name || "User"}</p>
                <p className="app-topbar__role">{user?.role || "Member"}</p>
              </div>
            </div>
            <button type="button" className="app-topbar__logout" onClick={logout}>
              Logout
            </button>
          </div>
        </header>

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppShell;
