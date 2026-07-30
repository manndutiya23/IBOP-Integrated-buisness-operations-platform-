import { useId } from "react";
import "./KPICard.css";

const accentClassMap = {
	brand: "brand",
	burgundy: "brand",
	maroon: "brand",
	green: "green",
	success: "green",
	blue: "blue",
	info: "blue",
	orange: "orange",
	warning: "orange",
	yellow: "orange",
	red: "red",
	danger: "red",
	error: "red",
	neutral: "neutral",
	gray: "neutral",
	grey: "neutral",
};

const statusClassMap = {
	paid: "success",
	active: "success",
	ok: "success",
	approved: "success",
	delivered: "success",
	invoiced: "success",
	pending: "warning",
	review: "warning",
	reviewing: "warning",
	attention: "warning",
	draft: "neutral",
	queued: "neutral",
	info: "info",
	updated: "info",
	overdue: "danger",
	failure: "danger",
	failed: "danger",
	rejected: "danger",
	cancelled: "danger",
	canceled: "danger",
};

function joinClasses(...classes) {
	return classes.filter(Boolean).join(" ");
}

function normalizeKey(value) {
	return String(value || "")
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function resolveAccentClass(accent, tone) {
	return accentClassMap[normalizeKey(accent)] || accentClassMap[normalizeKey(tone)] || "green";
}

function resolveStatusTone(status) {
	const normalized = normalizeKey(status);
	return statusClassMap[normalized] || "neutral";
}

function resolveTrendState(trendDirection, trend) {
	if (trendDirection) {
		return normalizeKey(trendDirection);
	}

	const trendText = String(trend ?? "").trim();
	if (!trendText) {
		return "flat";
	}

	if (/^[+]|up|growth|increase|higher|positive/i.test(trendText)) {
		return "up";
	}

	if (/^[-]|down|decline|decrease|lower|negative/i.test(trendText)) {
		return "down";
	}

	return "flat";
}

function formatTrendLabel(trend, trendState) {
	if (trend === null || trend === undefined || trend === "") {
		return null;
	}

	const trendText = String(trend).trim();
	const prefix = trendState === "up" ? "↑" : trendState === "down" ? "↓" : "→";

	if (trendText.startsWith(prefix)) {
		return trendText;
	}

	return `${prefix} ${trendText}`;
}

function formatLastUpdated(lastUpdated) {
	if (lastUpdated === null || lastUpdated === undefined || lastUpdated === "") {
		return null;
	}

	if (lastUpdated instanceof Date) {
		return { text: `Updated ${lastUpdated.toLocaleString()}`, dateTime: lastUpdated.toISOString() };
	}

	if (typeof lastUpdated === "number") {
		const date = new Date(lastUpdated);
		if (!Number.isNaN(date.getTime())) {
			return { text: `Updated ${date.toLocaleString()}`, dateTime: date.toISOString() };
		}
	}

	if (typeof lastUpdated === "string") {
		const parsed = new Date(lastUpdated);
		if (!Number.isNaN(parsed.getTime()) && /T|\d{2}:\d{2}|\d{4}-\d{2}-\d{2}/.test(lastUpdated)) {
			return { text: `Updated ${parsed.toLocaleString()}`, dateTime: parsed.toISOString() };
		}

		return { text: lastUpdated, dateTime: null };
	}

	return { text: String(lastUpdated), dateTime: null };
}

function KPICard({
	title,
	value,
	icon,
	trend,
	trendDirection,
	status,
	accent,
	loading = false,
	onClick,
	subtitle,
	lastUpdated,
	variant,
	tone,
	caption,
	badge,
	...rest
}) {
	const uid = useId();
	const titleId = `kpi-card-title-${uid}`;
	const subtitleId = `kpi-card-subtitle-${uid}`;
	const resolvedAccent = resolveAccentClass(accent, tone);
	const resolvedStatus = status ?? badge;
	const resolvedStatusTone = resolvedStatus ? resolveStatusTone(resolvedStatus) : null;
	const resolvedTrend = trend ?? rest.delta ?? null;
	const resolvedTrendState = resolveTrendState(trendDirection, resolvedTrend);
	const resolvedTrendLabel = formatTrendLabel(resolvedTrend, resolvedTrendState);
	const resolvedSubtitle = subtitle ?? caption ?? null;
	const resolvedLastUpdated = formatLastUpdated(lastUpdated);
	const resolvedVariant = normalizeKey(variant) || "structured";
	const interactive = typeof onClick === "function";
	const Component = interactive ? "button" : "article";
	const componentProps = interactive
		? {
			type: "button",
			onClick,
			disabled: loading,
			"aria-labelledby": titleId,
			"aria-describedby": resolvedSubtitle || resolvedLastUpdated ? subtitleId : undefined,
		}
		: {
			"aria-busy": loading || undefined,
			"aria-labelledby": titleId,
			"aria-describedby": resolvedSubtitle || resolvedLastUpdated ? subtitleId : undefined,
		};
	const cardClassName = joinClasses(
		"kpi-card",
		`kpi-card--accent-${resolvedAccent}`,
		`kpi-card--${resolvedVariant}`,
		resolvedStatusTone ? `kpi-card--status-${resolvedStatusTone}` : null,
		resolvedTrendState ? `kpi-card--trend-${resolvedTrendState}` : null,
		interactive ? "kpi-card--interactive" : null,
		loading ? "kpi-card--loading" : null,
		!value && !loading ? "kpi-card--empty" : null,
	);

	if (interactive) {
		return (
			<Component className={cardClassName} {...componentProps}>
				<span className="kpi-card__surface" aria-hidden="true" />
				<span className="kpi-card__shell">
					<span className="kpi-card__header">
						<span className="kpi-card__identity">
							{icon ? <span className="kpi-card__icon" aria-hidden="true">{icon}</span> : null}
							<span className="kpi-card__title-stack">
								<span id={titleId} className="kpi-card__title">
									{title}
								</span>
								{resolvedSubtitle ? <span className="kpi-card__subtitle kpi-card__subtitle--header">{resolvedSubtitle}</span> : null}
							</span>
						</span>
						{resolvedStatus ? <span className={`kpi-card__status kpi-card__status--${resolvedStatusTone}`}>{resolvedStatus}</span> : null}
					</span>

					{loading ? (
						<span className="kpi-card__loading" aria-hidden="true">
							<span className="kpi-card__loading-line kpi-card__loading-line--title" />
							<span className="kpi-card__loading-row">
								<span className="kpi-card__loading-line kpi-card__loading-line--value" />
								<span className="kpi-card__loading-chip" />
							</span>
							<span className="kpi-card__loading-line kpi-card__loading-line--subtitle" />
						</span>
					) : value ? (
						<span className="kpi-card__body">
							<span className="kpi-card__value-row">
								<span className="kpi-card__value">{value}</span>
								{resolvedTrendLabel ? (
									<span className={`kpi-card__trend kpi-card__trend--${resolvedTrendState}`}>
										<span className="kpi-card__trend-mark" aria-hidden="true">
											{resolvedTrendState === "up" ? "↑" : resolvedTrendState === "down" ? "↓" : "→"}
										</span>
										<span>{resolvedTrendLabel.replace(/^[↑↓→]\s?/, "")}</span>
									</span>
								) : null}
							</span>
							{resolvedSubtitle ? <span id={subtitleId} className="kpi-card__subtitle">{resolvedSubtitle}</span> : null}
							{resolvedLastUpdated ? (
								<span className="kpi-card__meta">
									{resolvedLastUpdated.dateTime ? (
										<time dateTime={resolvedLastUpdated.dateTime}>{resolvedLastUpdated.text}</time>
									) : (
										resolvedLastUpdated.text
									)}
								</span>
							) : null}
						</span>
					) : (
						<span className="kpi-card__empty" id={subtitleId}>
							<span className="kpi-card__empty-title">No data available</span>
							{resolvedSubtitle ? <span className="kpi-card__subtitle">{resolvedSubtitle}</span> : null}
							{resolvedLastUpdated ? <span className="kpi-card__meta">{resolvedLastUpdated.text}</span> : null}
						</span>
					)}
				</span>
			</Component>
		);
	}

	return (
		<Component className={cardClassName} {...componentProps}>
			<span className="kpi-card__surface" aria-hidden="true" />
			<div className="kpi-card__shell">
				<header className="kpi-card__header">
					<div className="kpi-card__identity">
						{icon ? <span className="kpi-card__icon" aria-hidden="true">{icon}</span> : null}
						<div className="kpi-card__title-stack">
							<h3 id={titleId} className="kpi-card__title">
								{title}
							</h3>
							{resolvedSubtitle ? <p className="kpi-card__subtitle kpi-card__subtitle--header">{resolvedSubtitle}</p> : null}
						</div>
					</div>
					{resolvedStatus ? <span className={`kpi-card__status kpi-card__status--${resolvedStatusTone}`}>{resolvedStatus}</span> : null}
				</header>

				{loading ? (
					<div className="kpi-card__loading" aria-hidden="true">
						<span className="kpi-card__loading-line kpi-card__loading-line--title" />
						<span className="kpi-card__loading-row">
							<span className="kpi-card__loading-line kpi-card__loading-line--value" />
							<span className="kpi-card__loading-chip" />
						</span>
						<span className="kpi-card__loading-line kpi-card__loading-line--subtitle" />
					</div>
				) : value ? (
					<div className="kpi-card__body">
						<div className="kpi-card__value-row">
							<p className="kpi-card__value">{value}</p>
							{resolvedTrendLabel ? (
								<span className={`kpi-card__trend kpi-card__trend--${resolvedTrendState}`}>
									<span className="kpi-card__trend-mark" aria-hidden="true">
										{resolvedTrendState === "up" ? "↑" : resolvedTrendState === "down" ? "↓" : "→"}
									</span>
									<span>{resolvedTrendLabel.replace(/^[↑↓→]\s?/, "")}</span>
								</span>
							) : null}
						</div>
						{resolvedSubtitle ? <p id={subtitleId} className="kpi-card__subtitle">{resolvedSubtitle}</p> : null}
						{resolvedLastUpdated ? (
							<p className="kpi-card__meta">
								{resolvedLastUpdated.dateTime ? (
									<time dateTime={resolvedLastUpdated.dateTime}>{resolvedLastUpdated.text}</time>
								) : (
									resolvedLastUpdated.text
								)}
							</p>
						) : null}
					</div>
				) : (
					<div className="kpi-card__empty" id={subtitleId}>
						<strong className="kpi-card__empty-title">No data available</strong>
						{resolvedSubtitle ? <p className="kpi-card__subtitle">{resolvedSubtitle}</p> : null}
						{resolvedLastUpdated ? (
							<p className="kpi-card__meta">{resolvedLastUpdated.text}</p>
						) : null}
					</div>
				)}
			</div>
		</Component>
	);
}

export default KPICard;