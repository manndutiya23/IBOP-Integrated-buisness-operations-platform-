import { Button, Card, SectionHeader } from "../Ui";
import { generateInvoicePDF } from "../../utils/pdfGenerator";
import "./InvoiceModal.css";

function InvoiceModal({

    invoice,

    onClose,

}) {

    if (!invoice) return null;

    return (

        <div className="invoice-modal">

            <div
                className="invoice-modal__backdrop"
                onClick={onClose}
            />

            <Card
                className="invoice-modal__card"
            >

                <SectionHeader

                    title={`Invoice INV-${invoice._id.slice(-6)}`}

                    subtitle="Invoice Details"

                />

                <div className="invoice-modal__grid">

                    <div>

                        <span>Company</span>

                        <strong>

                            {invoice.companyName}

                        </strong>

                    </div>

                    <div>

                        <span>Status</span>

                        <strong>

                            {invoice.status}

                        </strong>

                    </div>

                    <div>

                        <span>Product</span>

                        <strong>

                            {invoice.productName}

                        </strong>

                    </div>

                    <div>

                        <span>Quantity</span>

                        <strong>

                            {invoice.quantity}

                        </strong>

                    </div>

                </div>

                <div className="invoice-modal__summary">

                    <div>

                        <span>Subtotal</span>

                        <strong>

                            ₹{invoice.subtotal?.toFixed(2)}

                        </strong>

                    </div>

                    <div>

                        <span>GST (18%)</span>

                        <strong>

                            ₹{invoice.gst?.toFixed(2)}

                        </strong>

                    </div>

                    <div className="invoice-modal__total">

                        <span>Total</span>

                        <strong>

                            ₹{invoice.finalAmount?.toFixed(2)}

                        </strong>

                    </div>

                </div>

                <div className="invoice-modal__footer">

                    <span>

                        Due:

                        {" "}

                        {invoice.dueDate
                            ? new Date(
                                  invoice.dueDate
                              ).toLocaleDateString()
                            : "-"}

                    </span>

                    <div>

                        <Button

                            onClick={() =>
                                generateInvoicePDF(invoice)
                            }

                        >

                            Download PDF

                        </Button>

                        <Button

                            variant="secondary"

                            onClick={onClose}

                        >

                            Close

                        </Button>

                    </div>

                </div>

            </Card>

        </div>

    );

}

export default InvoiceModal;