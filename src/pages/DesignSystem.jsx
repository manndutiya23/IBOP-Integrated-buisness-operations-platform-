import "./DesignSystem.css";
import KPICard from "../components/Ui/KPICard/KPICard";
import Input from "../components/Ui/Input/Input";
import Select from "../components/Ui/Select/Select";
import Card from "../components/Ui/Card/Card";

const typographySamples = [
	{
		label: "Display / 40",
		value: "Monthly procurement variance is within tolerance",
		note: "Use for dashboard hero statements and internal documentation headers.",
		className: "design-system-type-sample--display",
	},
	{
		label: "Heading / 28",
		value: "Inventory health and purchase order flow",
		note: "Primary section titles for module pages.",
		className: "design-system-type-sample--heading",
	},
	{
		label: "Body / 16",
		value: "Displays concise ERP guidance, validation notes, and status summaries.",
		note: "Use for standard descriptive copy and form instructions.",
		className: "design-system-type-sample--body",
	},
];

const buttonSamples = [
	{ label: "Primary", className: "design-system-button--primary" },
	{ label: "Secondary", className: "design-system-button--secondary" },
	{ label: "Success", className: "design-system-button--success" },
	{ label: "Danger", className: "design-system-button--danger" },
	{ label: "Ghost", className: "design-system-button--ghost" },
];

const kpiCards = [
	{
		title: "Monthly Revenue",
		value: "KES 4.82M",
		trend: "+12.4%",
		trendDirection: "up",
		status: "Closed",
		accent: "brand",
		subtitle: "Compared with the previous billing cycle across all branches.",
		lastUpdated: "Updated 12 min ago",
		icon: <RevenueIcon />,
		onClick: () => {},
	},
	{
		title: "Open Purchase Orders",
		value: "28",
		trend: "5 ready for follow-up",
		trendDirection: "flat",
		status: "Pending",
		accent: "blue",
		subtitle: "Pharmacy and lab supply orders awaiting supplier confirmation.",
		lastUpdated: "Updated 18 min ago",
		icon: <PurchaseOrderIcon />,
	},
	{
		title: "Inventory Value",
		value: "KES 18.4M",
		trend: "+3.1%",
		trendDirection: "up",
		status: "Healthy",
		accent: "green",
		subtitle: "Combined stock value across warehouse and branch inventory.",
		lastUpdated: "Updated 6 min ago",
		icon: <InventoryIcon />,
	},
	{
		title: "Pending Payments",
		value: "KES 2.1M",
		trend: "-8.6%",
		trendDirection: "down",
		status: "Attention",
		accent: "orange",
		subtitle: "Receivables aging beyond 14 days across retail accounts.",
		lastUpdated: "Updated 9 min ago",
		icon: <PaymentsIcon />,
	},
	{
		title: "Low Stock Items",
		value: "7 SKUs",
		trend: "3 added this morning",
		trendDirection: "flat",
		status: "Warning",
		accent: "red",
		subtitle: "Medicines and consumables nearing reorder thresholds.",
		lastUpdated: "Updated 4 min ago",
		icon: <LowStockIcon />,
	},
	{
		title: "Employees",
		value: "142",
		trend: null,
		trendDirection: null,
		status: "Loading",
		accent: "neutral",
		loading: true,
		subtitle: "HR headcount and active roster will populate from the employee service.",
		lastUpdated: null,
		icon: <EmployeeIcon />,
	},
];

function RevenueIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path d="M4 17V7" />
			<path d="M8 17V11" />
			<path d="M12 17V5" />
			<path d="M16 17V9" />
			<path d="M20 17V13" />
			<path d="M4 17h16" />
		</svg>
	);
}

function PurchaseOrderIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path d="M7 7h10" />
			<path d="M7 12h10" />
			<path d="M7 17h6" />
			<path d="M6 4.5h12a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1Z" />
		</svg>
	);
}

function InventoryIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path d="m4 8 8-4 8 4-8 4-8-4Z" />
			<path d="M4 8v8l8 4 8-4V8" />
			<path d="m12 12v8" />
		</svg>
	);
}

function PaymentsIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path d="M7 7h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
			<path d="M5 10h14" />
			<path d="M8 15h3" />
		</svg>
	);
}

function LowStockIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path d="M4 18h16" />
			<path d="M6 18V9" />
			<path d="M10 18V6" />
			<path d="M14 18v-4" />
			<path d="M18 18V8" />
			<path d="M6 9h12" />
		</svg>
	);
}

function EmployeeIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
			<path d="M5 20a7 7 0 0 1 14 0" />
		</svg>
	);
}

const modules = [
	{
		title: "Sales",
		description: "Track quotes, orders, and daily revenue movement.",
		meta: "128 active orders",
		tone: "sales",
	},
	{
		title: "Finance",
		description: "Monitor cash flow, invoices, and expense approvals.",
		meta: "18 pending approvals",
		tone: "finance",
	},
	{
		title: "Supply Chain",
		description: "Coordinate procurement, inventory, and supplier performance.",
		meta: "6 replenishment tasks",
		tone: "supply-chain",
	},
	{
		title: "HR",
		description: "View employee records, attendance, and onboarding status.",
		meta: "4 onboarding steps",
		tone: "hr",
	},
];

const statuses = [
	{ label: "Paid", className: "design-system-status--success" },
	{ label: "Pending", className: "design-system-status--warning" },
	{ label: "Overdue", className: "design-system-status--danger" },
	{ label: "Draft", className: "design-system-status--neutral" },
	{ label: "Delivered", className: "design-system-status--info" },
	{ label: "In Review", className: "design-system-status--accent" },
];

const tableRows = [
	{ ref: "SO-1042", customer: "Acme Foods Ltd.", amount: "KES 184,200", status: "Paid" },
	{ ref: "SO-1043", customer: "Northwind Retail", amount: "KES 92,500", status: "Pending" },
	{ ref: "SO-1044", customer: "Kijani Mart", amount: "KES 310,800", status: "Overdue" },
	{ ref: "SO-1045", customer: "BluePeak Clinic", amount: "KES 71,000", status: "Delivered" },
];

const alertSamples = [
	{
		tone: "success",
		title: "Inventory synced successfully",
		description: "All warehouse totals have been refreshed from the latest stock count.",
	},
	{
		tone: "warning",
		title: "Purchase order requires review",
		description: "Two items are above the approved budget threshold and need confirmation.",
	},
	{
		tone: "info",
		title: "New supplier quote received",
		description: "The procurement team can compare prices before final approval.",
	},
	{
		tone: "danger",
		title: "Payment failed for invoice INV-2221",
		description: "Retry the transaction or request a different payment method from the customer.",
	},
];

const emptyStates = [
	{
		title: "No invoices found",
		description: "Try a different date range or create a new invoice for the selected branch.",
		action: "Create invoice",
	},
	{
		title: "Nothing matches this filter",
		description: "Clear the search terms to reveal all matching ERP records.",
		action: "Reset filters",
	},
];

const loadingBlocks = ["56px", "36px", "44px", "28px", "60px", "40px"];

function DesignSection({ title, description, children }) {
	return (
		<section className="design-system-section">
			<div className="design-system-section__header">
				<div>
					<h2 className="design-system-section__title">{title}</h2>
					<p className="design-system-section__description">{description}</p>
				</div>
				<div className="design-system-section__divider" aria-hidden="true" />
			</div>
			<div className="design-system-preview">{children}</div>
		</section>
	);
}



function StatusChip({ label, className }) {
	return <span className={`design-system-status ${className}`}>{label}</span>;
}

function DesignSystem() {
	return (
		<div className="design-system-page">
			<header className="design-system-hero">
				<p className="design-system-hero__eyebrow">Internal UI component library</p>
				<h1 className="design-system-hero__title">IBOP Design System</h1>
				<p className="design-system-hero__subtitle">Reusable UI Components</p>
				<p className="design-system-hero__copy">
					This page previews the building blocks used across the IBOP ERP platform so developers can validate
					spacing, tone, and component behavior before shipping changes into production pages.
				</p>
			</header>

			<div className="design-system-sections">
				<DesignSection
					title="Typography"
					description="Core text styles used for headers, body copy, and dashboard messaging."
				>
					{typographySamples.map((sample) => (
						<Card key={sample.label} className="design-system-card--typography">
							<p className="design-system-card__label">{sample.label}</p>
							<h3 className={`design-system-type-sample ${sample.className}`}>{sample.value}</h3>
							<p className="design-system-card__note">{sample.note}</p>
						</Card>
					))}
				</DesignSection>

				<DesignSection title="Buttons" description="Actions for forms, dialogs, and module-level operations.">
					{buttonSamples.map((button) => (
						<button key={button.label} type="button" className={`design-system-button ${button.className}`}>
							{button.label}
						</button>
					))}
				</DesignSection>

				<DesignSection title="KPI Cards" description="Six real pharmaceutical ERP states shown as a component gallery.">
					{kpiCards.map((card) => (
						<KPICard
							key={card.title}
							title={card.title}
							value={card.value}
							trend={card.trend}
							trendDirection={card.trendDirection}
							status={card.status}
							accent={card.accent}
							loading={card.loading}
							onClick={card.onClick}
							subtitle={card.subtitle}
							lastUpdated={card.lastUpdated}
							icon={card.icon}
						/>
					))}
				</DesignSection>

				<DesignSection title="Module Cards" description="Entry points for major ERP workstreams and workflows.">
					{modules.map((module) => (
						<Card key={module.title} className={`design-system-module-card design-system-module-card--${module.tone}`}>
							<div className="design-system-module-card__topline">
								<p className="design-system-card__label">Module</p>
								<span className="design-system-module-card__meta">{module.meta}</span>
							</div>
							<h3 className="design-system-module-card__title">{module.title}</h3>
							<p className="design-system-module-card__description">{module.description}</p>
						</Card>
					))}
				</DesignSection>

				<DesignSection title="Status Badges" description="Compact indicators for workflow, payment, and delivery states.">
					{statuses.map((status) => (
						<StatusChip key={status.label} label={status.label} className={status.className} />
					))}
				</DesignSection>

				<DesignSection
    title="Inputs"
    description="Field patterns for search, names, dates, and numeric entries."
>
    <Card className="design-system-form-card">
        <div className="design-system-form-grid">

            <Input
                label="Search invoices"
                placeholder="Search invoice..."
                defaultValue="INV-2026"
            />

            <Input
                label="Supplier Name"
                defaultValue="Acme Supply Co."
            />

            <Input
                label="Quantity"
                type="number"
                defaultValue={24}
            />

            <Input
                label="Requested Date"
                type="date"
                defaultValue="2026-07-27"
            />

        </div>
    </Card>
</DesignSection>
				<DesignSection
    title="Dropdowns"
    description="Selection controls for branches, periods, and workflow filters."
>
    <Card className="design-system-form-card">
        <div className="design-system-form-grid">

            <Select
                label="Branch"
                defaultValue="nairobi"
            >
                <option value="nairobi">Nairobi HQ</option>
                <option value="mombasa">Mombasa Warehouse</option>
                <option value="kisumu">Kisumu Outlet</option>
            </Select>

            <Select
                label="Period"
                defaultValue="q3"
            >
                <option value="today">Today</option>
                <option value="q3">Q3 2026</option>
                <option value="year">This Year</option>
            </Select>

            <Select
                label="Approval Status"
                defaultValue="pending"
            >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
            </Select>

        </div>
    </Card>
</DesignSection>

				<DesignSection title="Tables" description="Structured records for sales, purchasing, and finance workflows.">
					<Card className="design-system-table-card">
						<div className="design-system-table-wrap">
							<table className="design-system-table">
								<thead>
									<tr>
										<th>Reference</th>
										<th>Customer</th>
										<th>Amount</th>
										<th>Status</th>
									</tr>
								</thead>
								<tbody>
									{tableRows.map((row) => (
										<tr key={row.ref}>
											<td>{row.ref}</td>
											<td>{row.customer}</td>
											<td>{row.amount}</td>
											<td>
												<StatusChip
													label={row.status}
													className={
														row.status === "Paid"
															? "design-system-status--success"
															: row.status === "Pending"
																? "design-system-status--warning"
																: row.status === "Delivered"
																	? "design-system-status--info"
																	: "design-system-status--danger"
													}
												/>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<div className="design-system-table-card__summary">
							<p className="design-system-card__label">Table preview</p>
							<p className="design-system-card__note">Designed for dense ERP records with scan-friendly spacing.</p>
						</div>
					</Card>
				</DesignSection>

				<DesignSection title="Charts" description="Compact visual summaries used inside dashboards and module summaries.">
					<Card className="design-system-chart-card">
						<div className="design-system-chart-card__header">
							<div>
								<p className="design-system-card__label">Revenue trend</p>
								<h3 className="design-system-chart-card__title">Sales performance by week</h3>
							</div>
							<span className="design-system-chart-card__badge">KES</span>
						</div>
						<div className="design-system-bar-chart" aria-label="Revenue trend chart" role="img">
							<div className="design-system-bar-chart__bar design-system-bar-chart__bar--h-40" />
							<div className="design-system-bar-chart__bar design-system-bar-chart__bar--h-72" />
							<div className="design-system-bar-chart__bar design-system-bar-chart__bar--h-56" />
							<div className="design-system-bar-chart__bar design-system-bar-chart__bar--h-88" />
							<div className="design-system-bar-chart__bar design-system-bar-chart__bar--h-64" />
							<div className="design-system-bar-chart__bar design-system-bar-chart__bar--h-96" />
						</div>
					</Card>
					<Card className="design-system-chart-card design-system-chart-card--secondary">
						<p className="design-system-card__label">Expense mix</p>
						<div className="design-system-donut">
							<div className="design-system-donut__ring" />
							<div className="design-system-donut__center">
								<strong>63%</strong>
								<span>Operational spend</span>
							</div>
						</div>
					</Card>
				</DesignSection>

				<DesignSection title="Alerts" description="Feedback states for success, warning, information, and errors.">
					{alertSamples.map((alert) => (
						<Card key={alert.title} className={`design-system-alert design-system-alert--${alert.tone}`}>
							<p className="design-system-alert__title">{alert.title}</p>
							<p className="design-system-alert__description">{alert.description}</p>
						</Card>
					))}
				</DesignSection>

				<DesignSection title="Empty States" description="Encouraging messages for unpopulated data and search results.">
					{emptyStates.map((state) => (
						<Card key={state.title} className="design-system-empty-state">
							<div className="design-system-empty-state__icon" aria-hidden="true">
								⋯
							</div>
							<h3 className="design-system-empty-state__title">{state.title}</h3>
							<p className="design-system-empty-state__description">{state.description}</p>
							<button type="button" className="design-system-button design-system-button--secondary">
								{state.action}
							</button>
						</Card>
					))}
				</DesignSection>

				<DesignSection title="Loading States" description="Skeletons and spinners for data that is still being fetched.">
					<Card className="design-system-loading-card">
						<div className="design-system-spinner" aria-hidden="true" />
						<div className="design-system-skeleton-stack">
							{loadingBlocks.map((block, index) => (
								<div
									key={String(index)}
									className={`design-system-skeleton design-system-skeleton--${index + 1}`}
									data-width={block}
								/>
							))}
						</div>
					</Card>
				</DesignSection>
			</div>
		</div>
	);
}

export default DesignSystem;
