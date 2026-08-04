import { Link } from "react-router-dom";

import {

    Button,

    Input,

    Select,

} from "../Ui";

import "./EmployeeToolbar.css";

function EmployeeToolbar({

    searchTerm,

    setSearchTerm,

    department,

    setDepartment,

    departments = [],

}) {

    return (

        <div className="employee-toolbar">

            <div className="employee-toolbar__left">

                <Input

                    placeholder="Search employees..."

                    value={searchTerm}

                    onChange={(event) =>
                        setSearchTerm(event.target.value)
                    }

                />

                <Select

                    value={department}

                    onChange={(event) =>
                        setDepartment(event.target.value)
                    }

                >

                    <option value="All">

                        All Departments

                    </option>

                    {departments.map((dept) => (

                        <option

                            key={dept}

                            value={dept}

                        >

                            {dept}

                        </option>

                    ))}

                </Select>

            </div>

            <div className="employee-toolbar__right">

                <Link to="/hr">

                    <Button>

                        + Add Employee

                    </Button>

                </Link>

            </div>

        </div>

    );

}

export default EmployeeToolbar;