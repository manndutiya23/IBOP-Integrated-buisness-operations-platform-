import { useMemo, useState } from "react";

import { useBusinessData } from "../context/BusinessDataContext";
import { useAuth } from "../context/AuthContext";

import {

    PageHeader,

    PageSection,

} from "../components/Ui";

import {

    EmployeeToolbar,

    EmployeeTable,

} from "../components/hr";

function Employees() {

    const {

        employees,

        deleteEmployee,

    } = useBusinessData();

    const { user } = useAuth();

    const role = user?.role;

    const [

        searchTerm,

        setSearchTerm,

    ] = useState("");

    const [

        department,

        setDepartment,

    ] = useState("All");

    const departments = useMemo(

        () =>

            [

                ...new Set(

                    employees

                        .map(

                            employee =>

                                employee.department

                        )

                        .filter(Boolean)

                ),

            ],

        [employees]

    );

    const filteredEmployees = useMemo(

        () =>

            employees.filter(employee => {

                const matchesSearch =

                    employee.name

                        ?.toLowerCase()

                        .includes(

                            searchTerm.toLowerCase()

                        )

                    ||

                    employee.email

                        ?.toLowerCase()

                        .includes(

                            searchTerm.toLowerCase()

                        );

                const matchesDepartment =

                    department === "All"

                    ||

                    employee.department ===

                    department;

                return (

                    matchesSearch

                    &&

                    matchesDepartment

                );

            }),

        [

            employees,

            searchTerm,

            department,

        ]

    );

    return (

        <>

            <PageHeader

                eyebrow="Human Resources"

                title="Employees"

                subtitle="View, search and manage employee records."

            />

            <PageSection

                title="Employee Directory"

                subtitle="Browse all employees."

            >

                <EmployeeToolbar

                    searchTerm={searchTerm}

                    setSearchTerm={setSearchTerm}

                    department={department}

                    setDepartment={setDepartment}

                    departments={departments}

                />

                <EmployeeTable

                    employees={filteredEmployees}

                    role={role}

                    onDelete={deleteEmployee}

                />

            </PageSection>

        </>

    );

}

export default Employees;