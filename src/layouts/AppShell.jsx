import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { filterNavigationByRole } from "../config/navigation";
import "./AppShell.css";
import "../assets/logo.png";

function AppShell({ user, logout }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const filteredSections = useMemo(
    () => filterNavigationByRole(user?.role || ""),
    [user?.role]
  );

  const activeModule = filteredSections.find(
    (section) =>
      section.kind === "module" &&
      section.items.some((item) => item.path === location.pathname)
  )?.title;

  const [expandedModules, setExpandedModules] = useState(() =>
    activeModule ? [activeModule] : []
  );

  useEffect(() => {
    if (activeModule) {
      setExpandedModules((current) =>
        current.includes(activeModule) ? current : [...current, activeModule]
      );
    }
  }, [activeModule]);

  const toggleModule = (moduleTitle) => {
    setExpandedModules((current) =>
      current.includes(moduleTitle)
        ? current.filter((title) => title !== moduleTitle)
        : [...current, moduleTitle]
    );
  };

  const closeMobileSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-shell">
      <aside className={`app-sidebar ${isSidebarOpen ? "is-open" : ""}`}>
        <div className="app-sidebar__brand">
          <div className="app-sidebar__logo">
            <img
              src={new URL("../assets/logo.png", import.meta.url).href}
              alt="IBOP Logo"
              className="app-sidebar__logo-image"
            />
          </div>
          <div>
            <p className="app-sidebar__eyebrow">Shrinath Enterprises</p>
            <h1 className="app-sidebar__title">IBOP Platform</h1>
          </div>
        </div>

        <nav className="app-sidebar__nav" aria-label="Main navigation">
          <div className="app-sidebar__section">
            {filteredSections.map((section) => {
              if (section.kind === "link") {
                return (
                  <NavLink
                    key={section.path}
                    to={section.path}
                    end
                    onClick={closeMobileSidebar}
                    className={({ isActive }) =>
                      `app-sidebar__link app-sidebar__dashboard-link ${isActive ? "is-active" : ""}`
                    }
                  >
                    {section.title}
                  </NavLink>
                );
              }

              const isExpanded = expandedModules.includes(section.title);
              const hasActivePage = section.items.some(
                (item) => item.path === location.pathname
              );

              return (
                <div
                  key={section.title}
                  className={`app-sidebar__module ${hasActivePage ? "has-active-page" : ""}`}
                >
                  <button
                    type="button"
                    className={`app-sidebar__module-toggle ${hasActivePage ? "is-current" : ""}`}
                    aria-expanded={isExpanded}
                    onClick={() => toggleModule(section.title)}
                  >
                    <span>{section.title}</span>
                    <svg
                      className={`app-sidebar__chevron ${isExpanded ? "is-expanded" : ""}`}
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="m5 7.5 5 5 5-5" />
                    </svg>
                  </button>

                  {isExpanded && (
                    <ul className="app-sidebar__submenu">
                      {section.items.map((item) => (
                        <li key={item.path}>
                          <NavLink
                            to={item.path}
                            end
                            onClick={closeMobileSidebar}
                            className={({ isActive }) =>
                              `app-sidebar__sublink ${isActive ? "is-active" : ""}`
                            }
                          >
                            {item.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        <div className="app-sidebar__footer">
          <p className="app-sidebar__version">IBOP v1.0.0</p>
          <p className="app-sidebar__status">All systems operational</p>
        </div>
      </aside>

      <div
        className={`app-shell__overlay ${isSidebarOpen ? "is-visible" : ""}`}
        onClick={closeMobileSidebar}
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
              <h2 className="app-topbar__greeting">
                Good morning, {user?.name || user?.username || "Team"}
              </h2>
              <p className="app-topbar__subtitle">
                Here is what is happening across your business today.
              </p>
            </div>
          </div>

          <div className="app-topbar__right">
            <input
              type="search"
              className="app-topbar__search"
              placeholder="Search anything..."
            />
            <div className="app-topbar__user">
              <span className="app-topbar__avatar">
                {(user?.name || "U").charAt(0)}
              </span>
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
