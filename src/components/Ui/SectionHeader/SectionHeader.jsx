import "./SectionHeader.css";

function SectionHeader({
    title,
    subtitle,
    actions,
    className = "",
}) {

    return (

        <div
            className={`ibop-section-header ${className}`}
        >

            <div className="ibop-section-header__content">

                {title && (

                    <h2 className="ibop-section-header__title">

                        {title}

                    </h2>

                )}

                {subtitle && (

                    <p className="ibop-section-header__subtitle">

                        {subtitle}

                    </p>

                )}

            </div>

            {actions && (

                <div className="ibop-section-header__actions">

                    {actions}

                </div>

            )}

        </div>

    );

}

export default SectionHeader;