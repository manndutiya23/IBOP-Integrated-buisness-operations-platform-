import { Button } from "../Ui";
import { generateInvoicePDF } from "../../utils/pdfGenerator";
import "./InvoiceModal.css";

function InvoiceModal({

    sale,

    onClose,

}) {

    if (!sale) return null;

    const handlePrint = () => {

        window.print();

    };

    return (

        <div className="invoice-modal">

            <div
                className="invoice-modal__backdrop"
                onClick={onClose}
            />

            <div className="invoice-modal__card">

                <h2>

                    Invoice

                </h2>

                <div className="invoice-modal__content">

                    <div>

                        <span>Company</span>

                        <strong>

                            {sale.companyName}

                        </strong>

                    </div>

                    <div>

                        <span>Product</span>

                        <strong>

                            {sale.productName}

                        </strong>

                    </div>

                    <div>

                        <span>Quantity</span>

                        <strong>

                            {sale.quantity}

                        </strong>

                    </div>

                    <div>

                        <span>Rate</span>

                        <strong>

                            ₹{Number(sale.rate).toLocaleString()}

                        </strong>

                    </div>

                    <div>

                        <span>Total</span>

                        <strong>

                            ₹{Number(sale.totalPrice).toLocaleString()}

                        </strong>

                    </div>

                    <div>

                        <span>Final Amount</span>

                        <strong>

                            ₹{Number(sale.finalAmount).toLocaleString()}

                        </strong>

                    </div>

                    <div>

                        <span>Date</span>

                        <strong>

                            {sale.date
                                ? new Date(
                                      sale.date
                                  ).toLocaleDateString()
                                : "-"}

                        </strong>

                    </div>

                </div>

                <div className="invoice-modal__actions">

                    <Button
                        onClick={() =>
                            generateInvoicePDF(sale)
                        }
                    >
                        Download PDF
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={handlePrint}
                    >
                        Print
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={onClose}
                    >
                        Close
                    </Button>

                </div>

            </div>

        </div>

    );

}

export default InvoiceModal;