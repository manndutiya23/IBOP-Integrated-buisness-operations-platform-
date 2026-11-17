export const navigationSections = [
  { kind: "link", title: "Dashboard", path: "/", roles: ["Admin", "Management", "Sales", "Finance", "HR", "Supply Chain"] },
  { kind: "module", title: "Sales", roles: ["Sales", "Management", "Admin"], items: [
    { label: "Overview", path: "/sales-module", roles: ["Sales", "Management", "Admin"] },
    { label: "Sales & Orders", path: "/sales", roles: ["Sales", "Management", "Admin"] },
    { label: "Create Sale", path: "/sales/new", roles: ["Sales", "Management", "Admin"] },
  ] },
  { kind: "module", title: "Finance", roles: ["Finance", "Management", "Admin"], items: [
    { label: "Overview", path: "/finance-module", roles: ["Finance", "Management", "Admin"] },
    { label: "Finance", path: "/finance", roles: ["Finance", "Management", "Admin"] },
    { label: "Invoices", path: "/invoices", roles: ["Finance", "Management", "Admin"] },
    { label: "Expenses", path: "/expenses", roles: ["Finance", "Management", "Admin"] },
  ] },
  { kind: "module", title: "Supply Chain", roles: ["Supply Chain", "Management", "Admin"], items: [
    { label: "Product List", path: "/product-list", roles: ["Supply Chain", "Management", "Admin"] },
    { label: "Inventory", path: "/products", roles: ["Supply Chain", "Management", "Admin"] },
    { label: "Create Purchase", path: "/purchases", roles: ["Supply Chain", "Management", "Admin"] },
    { label: "Purchase Invoices", path: "/purchase-invoices", roles: ["Supply Chain", "Management", "Admin"] },
  ] },
  { kind: "module", title: "HR", roles: ["HR", "Admin"], items: [
    { label: "Overview", path: "/hr-module", roles: ["HR", "Admin"] },
    { label: "Employees", path: "/employees", roles: ["HR", "Admin"] },
    { label: "HR & Payroll", path: "/hr", roles: ["HR", "Admin"] },
  ] },
];
export function filterNavigationByRole(userRole) {
  return navigationSections.map((section) => {
    if (section.kind === "link") return section.roles.includes(userRole) ? section : null;
    const items = section.items.filter((item) => item.roles.includes(userRole));
    return items.length ? { ...section, items } : null;
  }).filter(Boolean);
}
