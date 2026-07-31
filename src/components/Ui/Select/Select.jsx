import "./Select.css";

function Select({
    label,
    helperText,
    error,
    success,
    className = "",
    id,
    required = false,
    children,
    ...props
}) {
    const selectId =
        id ||
        props.name ||
        `select-${label?.replace(/\s+/g, "-").toLowerCase()}`;

    const stateClass = error
        ? "ibop-select--error"
        : success
        ? "ibop-select--success"
        : "";

    return (
        <div className={`ibop-select-group ${className}`}>
            {label && (
                <label
                    htmlFor={selectId}
                    className="ibop-select-label"
                >
                    {label}

                    {required && (
                        <span className="ibop-required">*</span>
                    )}
                </label>
            )}

            <select
                id={selectId}
                className={`ibop-select ${stateClass}`}
                {...props}
            >
                {children}
            </select>

            {(helperText || error) && (
                <p
                    className={`ibop-select-helper ${
                        error ? "ibop-select-helper--error" : ""
                    }`}
                >
                    {error || helperText}
                </p>
            )}
        </div>
    );
}

export default Select;