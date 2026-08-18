import { useMemo, useState } from "react";
import { useBusinessData } from "../context/BusinessDataContext";

import {
    PageHeader,
    PageSection,
} from "../components/Ui";

import {
    SalesKPIs,
    SalesToolbar,
    SalesTable,
    InvoiceModal,
} from "../components/sales";

function Sales() {

    const {

        sales,

        deleteSale,

        createInvoice,

    } = useBusinessData();

    const [selectedSale, setSelectedSale] =
        useState(null);

    const [searchTerm, setSearchTerm] =
        useState("");

    const filteredSales = useMemo(() => {

        const query =
            searchTerm.toLowerCase();

        return sales.filter((sale) => {

            return (

                sale.companyName
                    ?.toLowerCase()
                    .includes(query)

                ||

                sale.productName
                    ?.toLowerCase()
                    .includes(query)

                ||

                sale.salesperson
                    ?.toLowerCase()
                    .includes(query)

            );

        });

    }, [sales, searchTerm]);

    const handleCreateInvoice = async (
        sale
    ) => {

        try {

            await createInvoice(sale);

            setSelectedSale(sale);

        } catch (error) {

            console.error(error);

        }

    };

      return (

        <>

            <PageHeader

                eyebrow="Sales"

                title="Sales"

                description="Manage sales records, invoices and revenue."

            />

            <SalesKPIs

                sales={filteredSales}

            />

            <PageSection

                title="Sales Records"

                subtitle="Search and manage all completed sales."

            >

                <SalesToolbar

                    searchTerm={searchTerm}

                    setSearchTerm={setSearchTerm}

                />

                <SalesTable

                    sales={filteredSales}

                    onCreateInvoice={
                        handleCreateInvoice
                    }

                    onDeleteSale={
                        deleteSale
                    }

                />

            </PageSection>

            <InvoiceModal

                sale={selectedSale}

                onClose={() =>
                    setSelectedSale(null)
                }

            />

        </>

    );

}

export default Sales;