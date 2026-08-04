import { KPICard } from "../Ui";
import "./EmployeeKPIs.css";

function EmployeeKPIs({

    totalEmployees,

    departmentCount,

    hrCount,

    averageSalary,

}) {

    return (

        <section className="employee-kpis">

            <KPICard

                title="Employees"

                value={totalEmployees}

                subtitle="Total employees"

            />

            <KPICard

                title="Departments"

                value={departmentCount}

                subtitle="Active departments"

            />

            <KPICard

                title="HR Staff"

                value={hrCount}

                subtitle="Human Resources"

            />

            <KPICard

                title="Avg Salary"

                value={`₹${averageSalary.toLocaleString()}`}

                subtitle="Average employee salary"

            />

        </section>

    );

}

export default EmployeeKPIs;