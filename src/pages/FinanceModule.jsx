import { ModuleCard, PageHeader } from "../components/Ui";
import "./FinanceModule.css";

function FinanceModule() {

    const modules = [

        {
            title: "Finance Dashboard",
            description:
                "View financial KPIs, analytics and add business expenses.",
            path: "/finance",
        },

        {
            title: "Expenses",
            description:
                "Search, filter and manage all recorded expenses.",
            path: "/expenses",
        },

        {
            title: "Invoices",
            description:
                "View invoices and manage payment status.",
            path: "/invoices",
        },

    ];

    return (

        <>

            <PageHeader

                eyebrow="Finance"

                title="Finance Module"

                subtitle="Manage finances, expenses and invoices."

            />

            <section className="finance-module">

                {modules.map((module) => (

                    <ModuleCard

                        key={module.path}

                        title={module.title}

                        description={module.description}

                        to={module.path}

                    />

                ))}

            </section>

        </>

    );

}

export default FinanceModule;