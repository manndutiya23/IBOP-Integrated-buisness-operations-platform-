import { Link } from "react-router-dom";
import { Button, Input } from "../Ui";
import "./SalesToolbar.css";

function SalesToolbar({

    searchTerm,

    setSearchTerm,

}) {

    return (

        <div className="sales-toolbar">

            <div className="sales-toolbar__left">

                <Input
                    placeholder="Search company or product..."
                    value={searchTerm}
                    onChange={(event) =>
                        setSearchTerm(event.target.value)
                    }
                />

            </div>

            <div className="sales-toolbar__right">

                <Link to="/sales/new">

                    <Button>

                        + Create Sale

                    </Button>

                </Link>

            </div>

        </div>

    );

}

export default SalesToolbar;