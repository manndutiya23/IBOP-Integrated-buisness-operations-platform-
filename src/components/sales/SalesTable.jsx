import { useState } from "react";
import {
    DataTable,
    Button,
} from "../Ui";

import "./SalesTable.css";

function SalesTable({

    sales,

    onCreateInvoice,

    onDeleteSale,

}) {

    const [sortBy] = useState("date");

    const sortedSales = [...sales].sort((a, b) => {

        if (sortBy === "date") {

            return new Date(b.date) - new Date(a.date);

        }

        return 0;

    });

    return (

        <DataTable>

            <thead>

                <tr>

                    <th>Company</th>

                    <th>Product</th>

                    <th>Qty</th>

                    <th>Rate</th>

                    <th>Total</th>

                    <th>Discount</th>

                    <th>Final</th>

                    <th>Salesperson</th>

                    <th>Date</th>

                    <th>Actions</th>

                </tr>

            </thead>

            <tbody>

                {sortedSales.length === 0 ? (

                    <tr>

                        <td
                            colSpan="10"
                            className="datatable__empty"
                        >

                            No sales found.

                        </td>

                    </tr>

                ) : (

                    sortedSales.map((sale) => (

                        <tr
                            key={sale._id}
                        >

                            <td>

                                {sale.companyName}

                            </td>

                            <td>

                                {sale.productName}

                            </td>

                            <td>

                                {sale.quantity}

                            </td>

                            <td>

                                ₹{Number(
                                    sale.rate
                                ).toLocaleString()}

                            </td>

                            <td>

                                ₹{Number(
                                    sale.totalPrice
                                ).toLocaleString()}

                            </td>

                            <td>

                                {sale.discount}%

                            </td>

                            <td>

                                <strong>

                                    ₹{Number(
                                        sale.finalAmount
                                    ).toLocaleString()}

                                </strong>

                            </td>

                            <td>

                                {sale.salesperson}

                            </td>

                            <td>

                                {sale.date
                                    ? new Date(
                                          sale.date
                                      ).toLocaleDateString()
                                    : "-"}

                            </td>

                            <td>

                                <div className="sales-table__actions">
                                                                      <Button
                                        size="sm"
                                        onClick={() =>
                                            onCreateInvoice(sale)
                                        }
                                    >
                                        Invoice
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() =>
                                            onDeleteSale(sale._id)
                                        }
                                    >
                                        Delete
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

export default SalesTable;