import "./Input.css";

function Input({
    label,
    helperText,
    error,
    success,
    className = "",
    id,
    required = false,
    ...props
}) {
    const inputId =
        id ||
        props.name ||
        `input-${label?.replace(/\s+/g, "-").toLowerCase()}`;

    const stateClass = error
        ? "ibop-input--error"
        : success
        ? "ibop-input--success"
        : "";

    return (
        <div className={`ibop-input-group ${className}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="ibop-input-label"
                >
                    {label}

                    {required && (
                        <span className="ibop-required">*</span>
                    )}
                </label>
            )}

            <input
                id={inputId}
                className={`ibop-input ${stateClass}`}
                {...props}
            />

            {(helperText || error) && (
                <p
                    className={`ibop-input-helper ${
                        error ? "ibop-input-helper--error" : ""
                    }`}
                >
                    {error || helperText}
                </p>
            )}
        </div>
    );
}

export default Input;