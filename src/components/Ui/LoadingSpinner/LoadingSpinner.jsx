import "./LoadingSpinner.css";

function LoadingSpinner({
    size = "medium",
    label = "Loading...",
    fullScreen = false,
}) {

    return (

        <div
            className={`ibop-loading ${
                fullScreen ? "ibop-loading--fullscreen" : ""
            }`}
        >

            <div
                className={`ibop-spinner ibop-spinner--${size}`}
            />

            {label && (

                <p className="ibop-loading__label">

                    {label}

                </p>

            )}

        </div>

    );

}

export default LoadingSpinner;