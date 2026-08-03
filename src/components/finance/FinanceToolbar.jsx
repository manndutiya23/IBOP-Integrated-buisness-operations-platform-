import { Link } from "react-router-dom";
import { Button, Input, Select } from "../Ui";
import "./FinanceToolbar.css";

function FinanceToolbar({

    searchTerm,

    setSearchTerm,

    category,

    setCategory,

}) {

    return (

        <div className="finance-toolbar">

            <div className="finance-toolbar__left">

                <Input

                    placeholder="Search expenses..."

                    value={searchTerm}

                    onChange={(event) =>
                        setSearchTerm(event.target.value)
                    }

                />

                <Select

                    value={category}

                    onChange={(event) =>
                        setCategory(event.target.value)
                    }

                >

                    <option value="All">

                        All Categories

                    </option>

                    <option value="Purchase">

                        Purchase

                    </option>

                    <option value="Salaries">

                        Salaries

                    </option>

                    <option value="Other">

                        Other

                    </option>

                </Select>

            </div>

            <div className="finance-toolbar__right">

                <Link to="/finance">

                    <Button>

                        + Add Expense

                    </Button>

                </Link>

            </div>

        </div>

    );

}

export default FinanceToolbar;