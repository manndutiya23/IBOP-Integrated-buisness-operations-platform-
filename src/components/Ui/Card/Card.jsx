import "./Card.css";

function Card({
    title,
    subtitle,
    actions,
    children,
    className = "",
    padding = "normal",
}) {

    return (

        <section
            className={`ibop-card ibop-card--${padding} ${className}`}
        >

            {(title || subtitle || actions) && (

                <header className="ibop-card__header">

                    <div>

                        {title && (
                            <h3 className="ibop-card__title">
                                {title}
                            </h3>
                        )}

                        {subtitle && (
                            <p className="ibop-card__subtitle">
                                {subtitle}
                            </p>
                        )}

                    </div>

                    {actions && (

                        <div className="ibop-card__actions">

                            {actions}

                        </div>

                    )}

                </header>

            )}

            <div className="ibop-card__body">

                {children}

            </div>

        </section>

    );

}

export default Card;