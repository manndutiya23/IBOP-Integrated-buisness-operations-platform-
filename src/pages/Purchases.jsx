import { useMemo, useState } from "react";

import { useBusinessData } from "../context/BusinessDataContext";

import {

    Card,

    PageHeader,

    SectionHeader,

    SplitLayout,

} from "../components/Ui";

import {

    PurchaseForm,

    PurchaseKPIs,

    PurchaseTable,

} from "../components/purchases";

import "./Purchases.css";

function Purchases() {

    const {

        purchases,

        createPurchase,

    } = useBusinessData();

    const [form, setForm] = useState({

        productName: "",

        supplierName: "",

        quantity: "",

        purchasePrice: "",

        gst: 18,

        batchNumber: "",

        expiryDate: "",

        date: "",

    });

    const handleChange = (event) => {

        setForm({

            ...form,

            [event.target.name]:
                event.target.value,

        });

    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            await createPurchase({

                ...form,

                quantity: Number(form.quantity),

                purchasePrice: Number(form.purchasePrice),

                gst: Number(form.gst),

            });

            setForm({

                productName: "",

                supplierName: "",

                quantity: "",

                purchasePrice: "",

                gst: 18,

                batchNumber: "",

                expiryDate: "",

                date: "",

            });

        } catch (error) {

            console.error(error);

        }

    };

    const totalSpend = useMemo(

        () =>

            purchases.reduce(

                (sum, purchase) =>

                    sum +

                    (purchase.finalAmount || 0),

                0

            ),

        [purchases]

    );

    const supplierCount = useMemo(

        () =>

            new Set(

                purchases.map(

                    purchase => purchase.supplierName

                )

            ).size,

        [purchases]

    );

    const averageOrderValue =

        purchases.length

            ? totalSpend /

              purchases.length

            : 0;
            return (

<>

<PageHeader

    eyebrow="Supply Chain"

    title="Purchases"

    subtitle="Manage supplier purchases and procurement."

/>

<PurchaseKPIs

    totalPurchases={purchases.length}

    totalSpend={totalSpend}

    supplierCount={supplierCount}

    averageOrderValue={averageOrderValue}

/>

<SplitLayout>

<PurchaseForm

    form={form}

    handleChange={handleChange}

    handleSubmit={handleSubmit}

/>

<Card>

<SectionHeader

    title="Purchase History"

    subtitle="Latest procurement records."

/>

<PurchaseTable

    purchases={purchases}

/>

</Card>

</SplitLayout>
</>

);

}

export default Purchases;