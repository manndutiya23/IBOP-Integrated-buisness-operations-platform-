import { useState } from "react";

import { useBusinessData } from "../context/BusinessDataContext";

import {

    PageHeader,

    PageSection,

} from "../components/Ui";

import {

    FinanceToolbar,

    InvoiceTable,

    InvoiceModal,

} from "../components/finance";

function Invoices() {

    const {

        invoices,

        toggleInvoiceStatus,

    } = useBusinessData();

    const [

        selectedInvoice,

        setSelectedInvoice,

    ] = useState(null);

    const [

        searchTerm,

        setSearchTerm,

    ] = useState("");

    const [

        category,

        setCategory,

    ] = useState("All");

    const filteredInvoices = invoices.filter(

        invoice => {

            const matchesSearch =

                invoice.companyName

                    ?.toLowerCase()

                    .includes(

                        searchTerm.toLowerCase()

                    )

                ||

                invoice.productName

                    ?.toLowerCase()

                    .includes(

                        searchTerm.toLowerCase()

                    );

            if (!matchesSearch)

                return false;

            if (

                category === "All"

            )

                return true;

            return (

                invoice.status ===

                category.toLowerCase()

            );

        }

    );

    return (

        <>

            <PageHeader

                eyebrow="Finance"

                title="Invoices"

                subtitle="Manage customer invoices and payment status."

            />

            <PageSection

                title="Invoice Records"

                subtitle="View, search and manage invoices."

            >

<FinanceToolbar

    searchTerm={searchTerm}

    setSearchTerm={setSearchTerm}

    category={category}

    setCategory={setCategory}

    options={[

        "All",

        "Paid",

        "Unpaid",

        "Overdue",

    ]}

    searchPlaceholder="Search invoices..."

    addButtonText="Finance Dashboard"

    addButtonLink="/finance"

/>

                <InvoiceTable

                    invoices={filteredInvoices}

                    onView={setSelectedInvoice}

                    onToggleStatus={toggleInvoiceStatus}

                />

            </PageSection>

            <InvoiceModal

                invoice={selectedInvoice}

                onClose={() =>

                    setSelectedInvoice(null)

                }

            />

        </>

    );

}

export default Invoices;