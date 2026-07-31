import "./PageHeader.css";

function PageHeader({
    eyebrow,
    title,
    subtitle,
    actions,
}) {
    return (
        <header className="ibop-page-header">

            <div className="ibop-page-header__content">

                {eyebrow && (
                    <p className="ibop-page-header__eyebrow">
                        {eyebrow}
                    </p>
                )}

                <h1 className="ibop-page-header__title">
                    {title}
                </h1>

                {subtitle && (
                    <p className="ibop-page-header__subtitle">
                        {subtitle}
                    </p>
                )}

            </div>

            {actions && (

                <div className="ibop-page-header__actions">

                    {actions}

                </div>

            )}

        </header>
    );
}

export default PageHeader;