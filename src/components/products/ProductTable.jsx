import { DataTable, PageSection, StatusBadge } from "../Ui";
import "./ProductTable.css";

function ProductTable({ products }) {

    const columns = [

        {
            header: "Product",
            accessor: "name",
        },

        {
            header: "Price",
            render: (product) => (
                <>₹{Number(product.price).toLocaleString()}</>
            ),
        },

        {
            header: "Stock",
            render: (product) => (
                <>{product.stock} units</>
            ),
        },

        {
            header: "Batch",
            accessor: "batchNumber",
        },

        {
            header: "Expiry",
            render: (product) => {

                if (!product.expiryDate)
                    return "-";

                return new Date(
                    product.expiryDate
                ).toLocaleDateString();

            },
        },

        {
            header: "Status",
            render: (product) => {

                const stock = Number(product.stock);

                if (stock === 0) {

                    return (
                        <StatusBadge
                            status="danger"
                        >
                            Out of Stock
                        </StatusBadge>
                    );

                }

                if (stock <= 10) {

                    return (
                        <StatusBadge
                            status="warning"
                        >
                            Low Stock
                        </StatusBadge>
                    );

                }

                return (
                    <StatusBadge
                        status="success"
                    >
                        In Stock
                    </StatusBadge>
                );

            },
        },

    ];

    return (

        <PageSection
            title="Inventory"
            subtitle="Manage products currently available in stock."
        >

            <DataTable
                columns={columns}
                rows={products}
                emptyTitle="No products found"
                emptyDescription="Products will appear here after they are registered."
            />

        </PageSection>

    );

}

export default ProductTable;