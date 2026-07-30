export const navigationSections = [
  {
    title: "IBOP Platform",
    items: [
      { label: "Dashboard", path: "/", roles: ["Admin", "Management", "Sales", "Finance", "HR", "Supply Chain"] },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Inventory", path: "/products", roles: ["Supply Chain", "Management", "Admin"] },
      { label: "Sales & Orders", path: "/sales-module", roles: ["Sales", "Management", "Admin"] },
      { label: "Purchases", path: "/purchases", roles: ["Supply Chain", "Management", "Admin"] },
      { label: "Supply Chain", path: "/supply-chain", roles: ["Supply Chain", "Management", "Admin"] },
    ],
  },
  {
    title: "Finance",
    items: [
      { label: "Invoices", path: "/invoices", roles: ["Finance", "Management", "Admin"] },
      { label: "Expenses", path: "/expenses", roles: ["Finance", "Management", "Admin"] },
      { label: "Accounts", path: "/finance-module", roles: ["Finance", "Management", "Admin"] },
    ],
  },
  {
    title: "Workforce",
    items: [
      { label: "Employees", path: "/employees", roles: ["HR", "Admin"] },
      { label: "HR & Payroll", path: "/hr-module", roles: ["HR", "Admin"] },
    ],
  },
];

export function filterNavigationByRole(userRole) {
  return navigationSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.roles.includes(userRole)),
    }))
    .filter((section) => section.items.length > 0);
}
