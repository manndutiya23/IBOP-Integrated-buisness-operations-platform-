import { ModuleCard, PageHeader } from "../components/Ui";
import "./SalesModule.css";

function SalesModule() {

    const modules = [

        {
            title: "Sales Records",
            description:
                "View, search and manage all sales records.",
            path: "/sales",
        },

        {
            title: "Create Sale",
            description:
                "Create a new sales order and generate invoices.",
            path: "/sales/new",
        },

    ];

    return (

        <>

            <PageHeader

                eyebrow="Sales"

                title="Sales Module"

                subtitle="Manage sales operations and customer orders."

            />

            <section className="sales-module">

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

export default SalesModule;