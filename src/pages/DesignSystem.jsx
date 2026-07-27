import "./DesignSystem.css";

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
	{ label: "Monthly Revenue", value: "KES 4.82M", delta: "+12.4%", tone: "positive", footnote: "Compared with last month" },
	{ label: "Open Purchase Orders", value: "28", delta: "-5.1%", tone: "neutral", footnote: "Awaiting supplier confirmation" },
	{ label: "Stockout Risk", value: "7 SKUs", delta: "+2 alerts", tone: "warning", footnote: "Items below reorder point" },
	{ label: "Overdue Invoices", value: "11", delta: "-3 paid", tone: "negative", footnote: "Needs finance follow-up" },
];

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

function SectionCard({ children, className = "" }) {
	return <div className={`design-system-card ${className}`.trim()}>{children}</div>;
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
						<SectionCard key={sample.label} className="design-system-card--typography">
							<p className="design-system-card__label">{sample.label}</p>
							<h3 className={`design-system-type-sample ${sample.className}`}>{sample.value}</h3>
							<p className="design-system-card__note">{sample.note}</p>
						</SectionCard>
					))}
				</DesignSection>

				<DesignSection title="Buttons" description="Actions for forms, dialogs, and module-level operations.">
					{buttonSamples.map((button) => (
						<button key={button.label} type="button" className={`design-system-button ${button.className}`}>
							{button.label}
						</button>
					))}
				</DesignSection>

				<DesignSection title="KPI Cards" description="Snapshot metrics that help managers scan performance quickly.">
					{kpiCards.map((card) => (
						<SectionCard key={card.label} className="design-system-kpi-card">
							<p className="design-system-card__label">{card.label}</p>
							<div className="design-system-kpi-card__value-row">
								<h3 className="design-system-kpi-card__value">{card.value}</h3>
								<span className={`design-system-trend design-system-trend--${card.tone}`}>{card.delta}</span>
							</div>
							<p className="design-system-card__note">{card.footnote}</p>
						</SectionCard>
					))}
				</DesignSection>

				<DesignSection title="Module Cards" description="Entry points for major ERP workstreams and workflows.">
					{modules.map((module) => (
						<SectionCard key={module.title} className={`design-system-module-card design-system-module-card--${module.tone}`}>
							<div className="design-system-module-card__topline">
								<p className="design-system-card__label">Module</p>
								<span className="design-system-module-card__meta">{module.meta}</span>
							</div>
							<h3 className="design-system-module-card__title">{module.title}</h3>
							<p className="design-system-module-card__description">{module.description}</p>
						</SectionCard>
					))}
				</DesignSection>

				<DesignSection title="Status Badges" description="Compact indicators for workflow, payment, and delivery states.">
					{statuses.map((status) => (
						<StatusChip key={status.label} label={status.label} className={status.className} />
					))}
				</DesignSection>

				<DesignSection title="Inputs" description="Field patterns for search, names, dates, and numeric entries.">
					<SectionCard className="design-system-form-card">
						<div className="design-system-form-grid">
							<label className="design-system-field">
								<span className="design-system-field__label">Search invoices</span>
								<input className="design-system-input" type="text" defaultValue="INV-2026" />
							</label>
							<label className="design-system-field">
								<span className="design-system-field__label">Supplier name</span>
								<input className="design-system-input" type="text" defaultValue="Acme Supply Co." />
							</label>
							<label className="design-system-field">
								<span className="design-system-field__label">Quantity</span>
								<input className="design-system-input" type="number" defaultValue="24" />
							</label>
							<label className="design-system-field">
								<span className="design-system-field__label">Requested date</span>
								<input className="design-system-input" type="date" defaultValue="2026-07-27" />
							</label>
						</div>
					</SectionCard>
				</DesignSection>

				<DesignSection title="Dropdowns" description="Selection controls for branches, periods, and workflow filters.">
					<SectionCard className="design-system-form-card">
						<div className="design-system-form-grid">
							<label className="design-system-field">
								<span className="design-system-field__label">Branch</span>
								<select className="design-system-select" defaultValue="nairobi">
									<option value="nairobi">Nairobi HQ</option>
									<option value="mombasa">Mombasa Warehouse</option>
									<option value="kisumu">Kisumu Outlet</option>
								</select>
							</label>
							<label className="design-system-field">
								<span className="design-system-field__label">Period</span>
								<select className="design-system-select" defaultValue="q3">
									<option value="today">Today</option>
									<option value="q3">Q3 2026</option>
									<option value="year">This Year</option>
								</select>
							</label>
							<label className="design-system-field">
								<span className="design-system-field__label">Approval status</span>
								<select className="design-system-select" defaultValue="pending">
									<option value="all">All statuses</option>
									<option value="pending">Pending</option>
									<option value="approved">Approved</option>
									<option value="rejected">Rejected</option>
								</select>
							</label>
						</div>
					</SectionCard>
				</DesignSection>

				<DesignSection title="Tables" description="Structured records for sales, purchasing, and finance workflows.">
					<SectionCard className="design-system-table-card">
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
					</SectionCard>
				</DesignSection>

				<DesignSection title="Charts" description="Compact visual summaries used inside dashboards and module summaries.">
					<SectionCard className="design-system-chart-card">
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
					</SectionCard>
					<SectionCard className="design-system-chart-card design-system-chart-card--secondary">
						<p className="design-system-card__label">Expense mix</p>
						<div className="design-system-donut">
							<div className="design-system-donut__ring" />
							<div className="design-system-donut__center">
								<strong>63%</strong>
								<span>Operational spend</span>
							</div>
						</div>
					</SectionCard>
				</DesignSection>

				<DesignSection title="Alerts" description="Feedback states for success, warning, information, and errors.">
					{alertSamples.map((alert) => (
						<SectionCard key={alert.title} className={`design-system-alert design-system-alert--${alert.tone}`}>
							<p className="design-system-alert__title">{alert.title}</p>
							<p className="design-system-alert__description">{alert.description}</p>
						</SectionCard>
					))}
				</DesignSection>

				<DesignSection title="Empty States" description="Encouraging messages for unpopulated data and search results.">
					{emptyStates.map((state) => (
						<SectionCard key={state.title} className="design-system-empty-state">
							<div className="design-system-empty-state__icon" aria-hidden="true">
								⋯
							</div>
							<h3 className="design-system-empty-state__title">{state.title}</h3>
							<p className="design-system-empty-state__description">{state.description}</p>
							<button type="button" className="design-system-button design-system-button--secondary">
								{state.action}
							</button>
						</SectionCard>
					))}
				</DesignSection>

				<DesignSection title="Loading States" description="Skeletons and spinners for data that is still being fetched.">
					<SectionCard className="design-system-loading-card">
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
					</SectionCard>
				</DesignSection>
			</div>
		</div>
	);
}

export default DesignSystem;
