import "./StatusBadge.css";

function StatusBadge({

    status,

    variant,

    size = "md",

    children,

    onClick,

}) {

    const normalizedStatus =

        status?.toLowerCase();

    const badgeVariant =

        variant ||

        (normalizedStatus === "paid"

            ? "success"

            : normalizedStatus === "unpaid"

            ? "warning"

            : normalizedStatus === "overdue"

            ? "danger"

            : "default");

    return (

        <span
 onClick={onClick}
className={`
    ui-status-badge
    ui-status-badge--${badgeVariant}
    ui-status-badge--${size}
    ${onClick ? "ui-status-badge--clickable" : ""}
`}

        >

            {children || status}

        </span>

    );

}

export default StatusBadge;