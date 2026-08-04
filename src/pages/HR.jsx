import { useMemo, useState } from "react";

import { useBusinessData } from "../context/BusinessDataContext";
import { useAuth } from "../context/AuthContext";

import {

    Card,

    PageHeader,

    SectionHeader,

    SplitLayout,

} from "../components/Ui";

import {

    EmployeeForm,

    EmployeeKPIs,

    EmployeeTable,

} from "../components/hr";

import "./HR.css";

function HR() {

    const {

        employees,

        addEmployee,

    } = useBusinessData();

    const { user } = useAuth();

    const role = user?.role;

    const [form, setForm] = useState({

        name: "",

        email: "",

        role: "",

        department: "",

        salary: "",

        phone: "",

        joiningDate: "",

    });

    const handleChange = (event) => {

        setForm({

            ...form,

            [event.target.name]:
                event.target.value,

        });

    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (

            !form.name ||

            !form.role ||

            !form.department ||

            !form.salary ||

            !form.phone ||

            !form.joiningDate

        )

            return;

        await addEmployee({

            ...form,

            salary: Number(form.salary),

        });

        setForm({

            name: "",

            email: "",

            role: "",

            department: "",

            salary: "",

            phone: "",

            joiningDate: "",

        });

    };

    const departmentCount = useMemo(

        () =>

            new Set(

                employees

                    .map(

                        employee =>

                            employee.department

                    )

                    .filter(Boolean)

            ).size,

        [employees]

    );

    const hrCount = useMemo(

        () =>

            employees.filter(

                employee =>

                    employee.role === "HR"

            ).length,

        [employees]

    );

    const averageSalary = useMemo(

        () =>

            employees.length

                ? employees.reduce(

                      (sum, employee) =>

                          sum +

                          (employee.salary || 0),

                      0

                  ) /

                  employees.length

                : 0,

        [employees]

    );
    return (

<>

<PageHeader

    eyebrow="Human Resources"

    title="HR Dashboard"

    subtitle="Manage employees and human resource operations."

/>

<EmployeeKPIs

    totalEmployees={employees.length}

    departmentCount={departmentCount}

    hrCount={hrCount}

    averageSalary={averageSalary}

/>

<SplitLayout>

{(role === "HR" ||

role === "Admin") ? (

<EmployeeForm

    form={form}

    handleChange={handleChange}

    handleSubmit={handleSubmit}

/>

) : (

<Card>

<SectionHeader

    title="Human Resources"

    subtitle="You don't have permission to add employees."

/>

</Card>

)}

<Card>

<SectionHeader

    title="Recent Employees"

    subtitle="Latest employee records."

/>

<EmployeeTable

    employees={employees.slice(0,5)}

    role={role}

    onDelete={() => {}}

/>

</Card>

</SplitLayout>
</>

);

}

export default HR;