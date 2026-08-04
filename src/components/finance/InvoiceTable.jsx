import { Button, DataTable, StatusBadge } from "../Ui";
import "./InvoiceTable.css";

function InvoiceTable({

    invoices,

    onView,

    onToggleStatus,

}) {

    return (

        <DataTable>

            <thead>

                <tr>

                    <th>Invoice ID</th>

                    <th>Company</th>

                    <th>Product</th>

                    <th>Quantity</th>

                    <th>Amount</th>

                    <th>Status</th>

                    <th>Date</th>

                    <th>Actions</th>

                </tr>

            </thead>

            <tbody>

                {invoices.length === 0 ? (

                    <tr>

                        <td
                            colSpan="8"
                            className="datatable__empty"
                        >

                            No invoices found.

                        </td>

                    </tr>

                ) : (

                    invoices.map((invoice) => (

                        <tr key={invoice._id}>

                            <td>

                                INV-

                                {invoice._id.slice(-6)}

                            </td>

                            <td>

                                {invoice.companyName}

                            </td>

                            <td>

                                {invoice.productName}

                            </td>

                            <td>

                                {invoice.quantity}

                            </td>

                            <td>

                                ₹

                                {Number(
                                    invoice.finalAmount
                                ).toLocaleString()}

                            </td>

<td>

    <StatusBadge

        status={invoice.status}

        onClick={() => onToggleStatus(invoice._id)}

    />

</td>

                            <td>

                                {invoice.date
                                    ? new Date(
                                          invoice.date
                                      ).toLocaleDateString()
                                    : "-"}

                            </td>

                            <td>

                                <div className="invoice-table__actions">

                                    <Button

                                        size="sm"

                                        onClick={() =>
                                            onView(invoice)
                                        }

                                    >

                                        View

                                    </Button>



                                </div>

                            </td>

                        </tr>

                    ))

                )}

            </tbody>

        </DataTable>

    );

}

export default InvoiceTable;