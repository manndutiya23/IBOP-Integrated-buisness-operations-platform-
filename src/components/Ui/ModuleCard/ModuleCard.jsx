import { Link } from "react-router-dom";
import "./ModuleCard.css";

function ModuleCard({

    title,

    description,

    to,

    icon,

    footer = "Open Module →",

}) {

    return (

        <Link
            to={to}
            className="ibop-module-card"
        >

            <div className="ibop-module-card__content">

                {icon && (

                    <div className="ibop-module-card__icon">

                        {icon}

                    </div>

                )}

                <div>

                    <p className="ibop-module-card__eyebrow">

                        Module

                    </p>

                    <h3 className="ibop-module-card__title">

                        {title}

                    </h3>

                    <p className="ibop-module-card__description">

                        {description}

                    </p>

                </div>

            </div>

            <span className="ibop-module-card__footer">

                {footer}

            </span>

        </Link>

    );

}

export default ModuleCard;