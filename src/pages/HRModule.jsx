import { ModuleCard, PageHeader } from "../components/Ui";
import "./HRModule.css";

function HRModule() {

    const modules = [

        {

            title: "HR Dashboard",

            description:
                "Manage employees, HR analytics and recruitment.",

            path: "/hr",

        },

        {

            title: "Employees",

            description:
                "View, search and manage employee records.",

            path: "/employees",

        },

    ];

    return (

        <>

            <PageHeader

                eyebrow="Human Resources"

                title="HR Module"

                subtitle="Manage employees and human resource operations."

            />

            <section className="hr-module">

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

export default HRModule;