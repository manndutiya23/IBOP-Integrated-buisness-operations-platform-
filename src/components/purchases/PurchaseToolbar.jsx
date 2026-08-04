import { Link } from "react-router-dom";

import {

    Button,

    Input,

    Select,

} from "../Ui";

import "./PurchaseToolbar.css";

function PurchaseToolbar({

    searchTerm,

    setSearchTerm,

    supplier,

    setSupplier,

    suppliers = [],

}) {

    return (

        <div className="purchase-toolbar">

            <div className="purchase-toolbar__left">

                <Input

                    placeholder="Search purchases..."

                    value={searchTerm}

                    onChange={(event) =>
                        setSearchTerm(event.target.value)
                    }

                />

                <Select

                    value={supplier}

                    onChange={(event) =>
                        setSupplier(event.target.value)
                    }

                >

                    <option value="All">

                        All Suppliers

                    </option>

                    {suppliers.map((name) => (

                        <option

                            key={name}

                            value={name}

                        >

                            {name}

                        </option>

                    ))}

                </Select>

            </div>

            <div className="purchase-toolbar__right">

                <Link to="/purchases">

                    <Button>

                        + Create Purchase

                    </Button>

                </Link>

            </div>

        </div>

    );

}

export default PurchaseToolbar;