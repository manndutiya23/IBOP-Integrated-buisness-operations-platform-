import {

    Button,

    Card,

    Input,

    SectionHeader,

} from "../Ui";

import "./PurchaseForm.css";

function PurchaseForm({

    form,

    handleChange,

    handleSubmit,

}) {

    return (

        <Card>

            <SectionHeader

                title="Create Purchase"

                subtitle="Record a supplier purchase."

            />

            <form

                onSubmit={handleSubmit}

                className="purchase-form"

            >

                <div className="purchase-form__grid">

                    <div className="ibop-input-group">

                        <label>

                            Product Name

                        </label>

                        <Input

                            name="productName"

                            value={form.productName}

                            onChange={handleChange}

                            placeholder="Enter product"

                            required

                        />

                    </div>

                    <div className="ibop-input-group">

                        <label>

                            Supplier Name

                        </label>

                        <Input

                            name="supplierName"

                            value={form.supplierName}

                            onChange={handleChange}

                            placeholder="Enter supplier"

                            required

                        />

                    </div>

                    <div className="ibop-input-group">

                        <label>

                            Quantity

                        </label>

                        <Input

                            type="number"

                            name="quantity"

                            value={form.quantity}

                            onChange={handleChange}

                            required

                        />

                    </div>

                    <div className="ibop-input-group">

                        <label>

                            Purchase Price

                        </label>

                        <Input

                            type="number"

                            name="purchasePrice"

                            value={form.purchasePrice}

                            onChange={handleChange}

                            required

                        />

                    </div>

                    <div className="ibop-input-group">

                        <label>

                            GST %

                        </label>

                        <Input

                            type="number"

                            name="gst"

                            value={form.gst}

                            onChange={handleChange}

                        />

                    </div>

                    <div className="ibop-input-group">

                        <label>

                            Batch Number

                        </label>

                        <Input

                            name="batchNumber"

                            value={form.batchNumber}

                            onChange={handleChange}

                        />

                    </div>

                    <div className="ibop-input-group">

                        <label>

                            Expiry Date

                        </label>

                        <Input

                            type="date"

                            name="expiryDate"

                            value={form.expiryDate}

                            onChange={handleChange}

                        />

                    </div>

                    <div className="ibop-input-group">

                        <label>

                            Purchase Date

                        </label>

                        <Input

                            type="date"

                            name="date"

                            value={form.date}

                            onChange={handleChange}

                            required

                        />

                    </div>

                </div>

                <div className="purchase-form__actions">

                    <Button

                        type="submit"

                    >

                        Create Purchase

                    </Button>

                </div>

            </form>

        </Card>

    );

}

export default PurchaseForm;