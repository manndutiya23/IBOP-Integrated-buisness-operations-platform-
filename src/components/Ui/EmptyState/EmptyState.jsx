import "./EmptyState.css";
import Button from "../Button/Button";

function EmptyState({
    title,
    description,
    actionLabel,
    onAction,
    icon = "📦",
}) {
    return (
        <div className="ibop-empty-state">

            <div className="ibop-empty-state__icon">
                {icon}
            </div>

            <h3 className="ibop-empty-state__title">
                {title}
            </h3>

            {description && (
                <p className="ibop-empty-state__description">
                    {description}
                </p>
            )}

            {actionLabel && (
                <Button
                    variant="secondary"
                    onClick={onAction}
                >
                    {actionLabel}
                </Button>
            )}

        </div>
    );
}

export default EmptyState;