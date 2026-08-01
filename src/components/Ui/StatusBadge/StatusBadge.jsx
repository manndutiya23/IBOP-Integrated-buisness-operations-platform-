import "./StatusBadge.css";

function StatusBadge({

    children,

    variant = "default",

    size = "md",

}) {

    return (

        <span
            className={`
                ui-status-badge
                ui-status-badge--${variant}
                ui-status-badge--${size}
            `}
        >
            {children}
        </span>

    );

}

export default StatusBadge;