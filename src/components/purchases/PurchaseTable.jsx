import { DataTable } from "../Ui";
import "./PurchaseTable.css";

function PurchaseTable({

    purchases,

}) {

    return (

        <DataTable>

            <thead>

                <tr>

                    <th>Product</th>

                    <th>Supplier</th>

                    <th>Quantity</th>

                    <th>Price</th>

                    <th>GST</th>

                    <th>Total</th>

                    <th>Batch</th>

                    <th>Expiry</th>

                    <th>Date</th>

                </tr>

            </thead>

            <tbody>

                {purchases.length === 0 ? (

                    <tr>

                        <td

                            colSpan="9"

                            className="datatable__empty"

                        >

                            No purchases found.

                        </td>

                    </tr>

                ) : (

                    purchases.map((purchase) => (

                        <tr key={purchase._id}>

                            <td>

                                {purchase.productName}

                            </td>

                            <td>

                                {purchase.supplierName}

                            </td>

                            <td>

                                {purchase.quantity}

                            </td>

                            <td>

                                ₹{Number(
                                    purchase.purchasePrice
                                ).toLocaleString()}

                            </td>

                            <td>

                                {purchase.gst}%

                            </td>

                            <td>

                                ₹{Number(
                                    purchase.finalAmount
                                ).toLocaleString()}

                            </td>

                            <td>

                                {purchase.batchNumber || "-"}

                            </td>

                            <td>

                                {purchase.expiryDate

                                    ? new Date(
                                          purchase.expiryDate
                                      ).toLocaleDateString()

                                    : "-"}

                            </td>

                            <td>

                                {purchase.date

                                    ? new Date(
                                          purchase.date
                                      ).toLocaleDateString()

                                    : "-"}

                            </td>

                        </tr>

                    ))

                )}

            </tbody>

        </DataTable>

    );

}

export default PurchaseTable;