import "./PageSection.css";

function PageSection({
    title,
    subtitle,
    actions,
    children,
    className = "",
}) {
    return (
        <section className={`ibop-page-section ${className}`}>

            {(title || subtitle || actions) && (

                <header className="ibop-page-section__header">

                    <div>

                        {title && (

                            <h2 className="ibop-page-section__title">

                                {title}

                            </h2>

                        )}

                        {subtitle && (

                            <p className="ibop-page-section__subtitle">

                                {subtitle}

                            </p>

                        )}

                    </div>

                    {actions && (

                        <div className="ibop-page-section__actions">

                            {actions}

                        </div>

                    )}

                </header>

            )}

            <div className="ibop-page-section__body">

                {children}

            </div>

        </section>
    );
}

export default PageSection;