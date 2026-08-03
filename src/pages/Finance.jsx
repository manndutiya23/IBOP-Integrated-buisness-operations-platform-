import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useBusinessData } from "../context/BusinessDataContext";
import { useAuth } from "../context/AuthContext";
import "./Finance.css";

import {
    PageHeader,
    PageSection,
    SplitLayout,
    Card,
    SectionHeader,
} from "../components/Ui";

import {

    FinanceKPIs,

    ExpenseForm,

    ExpenseTable,

} from "../components/finance";

import {

    PieChart,

    Pie,

    Cell,

    Tooltip,

    ResponsiveContainer,

    BarChart,

    Bar,

    XAxis,

    YAxis,

    CartesianGrid,

    Legend,

} from "recharts";

function Finance() {

    const {

        expenses,

        invoices,

        purchases,

        addExpense,

        totalRevenue,

        totalExpenses,

        profit,

    } = useBusinessData();

    const { user } = useAuth();

    const role = user?.role;

    const [form, setForm] = useState({

        title: "",

        amount: "",

        category: "Other",

        date: "",

    });

    const unpaidInvoices = useMemo(

        () =>

            invoices.filter(

                invoice =>

                    invoice.status === "unpaid"

            ),

        [invoices]

    );

    const pendingPayments = useMemo(

        () =>

            unpaidInvoices.reduce(

                (sum, invoice) =>

                    sum +

                    (invoice.finalAmount || 0),

                0

            ),

        [unpaidInvoices]

    );

    const totalGSTCollected = useMemo(

        () =>

            invoices.reduce(

                (sum, invoice) =>

                    sum +

                    (invoice.gst || 0),

                0

            ),

        [invoices]

    );

    const averageInvoiceValue =

        invoices.length

            ? totalRevenue / invoices.length

            : 0;

    const totalProcurementSpend =

        purchases.reduce(

            (sum, purchase) =>

                sum +

                (purchase.finalAmount || 0),

            0

        );

    const supplierTotals = {};

    purchases.forEach(purchase => {

        const supplier =

            purchase.supplierName ||

            "Unknown";

        supplierTotals[supplier] =

            (supplierTotals[supplier] || 0)

            +

            (purchase.finalAmount || 0);

    });

    const topSupplier =

        Object.entries(

            supplierTotals

        )

            .sort(

                (a, b) => b[1] - a[1]

            )[0]?.[0]

        ||

        "N/A";

    const categoryTotals = {};

    expenses.forEach(expense => {

        const category =

            expense.category ||

            "Other";

        categoryTotals[category] =

            (categoryTotals[category] || 0)

            +

            expense.amount;

    });

    const expenseCategoryData =

        Object.entries(categoryTotals)

            .map(

                ([name, value]) => ({

                    name,

                    value,

                })

            );

    const financeComparisonData = [

        {

            name: "Finance",

            Revenue: totalRevenue,

            Expenses: totalExpenses,

        },

    ];

    const COLORS = [

        "#34d399",

        "#facc15",

        "#60a5fa",

        "#f87171",

        "#a78bfa",

        "#fb923c",

    ];

    const handleChange = event => {

        setForm({

            ...form,

            [event.target.name]:

                event.target.value,

        });

    };

    const handleSubmit = async event => {

        event.preventDefault();

        if (

            !form.title ||

            !form.amount ||

            !form.date

        )

            return;

        try {

            await addExpense({

                title: form.title,

                amount: Number(

                    form.amount

                ),

                category: form.category,

                date: form.date,

            });

            setForm({

                title: "",

                amount: "",

                category: "Other",

                date: "",

            });

        } catch (error) {

            console.error(error);

        }

    };return (

<>

<PageHeader

    eyebrow="Finance"

    title="Finance Dashboard"

    subtitle="Manage business finances, expenses and analytics."

/>

<FinanceKPIs

    totalRevenue={totalRevenue}

    totalExpenses={totalExpenses}

    profit={profit}

    pendingPayments={pendingPayments}

    totalGSTCollected={totalGSTCollected}

    averageInvoiceValue={averageInvoiceValue}

    totalProcurementSpend={totalProcurementSpend}

    topSupplier={topSupplier}

/>

<SplitLayout>

{(role === "Finance" ||

role === "Management" ||

role === "Admin") ? (

<ExpenseForm

    form={form}

    handleChange={handleChange}

    handleSubmit={handleSubmit}

/>

) : (

<Card>

<SectionHeader

    title="Finance"

    subtitle="You don't have permission to add expenses."

/>

</Card>

)}

<Card>

<SectionHeader

    title="Recent Expenses"

    subtitle="Latest expense entries."

    actions={

        <Link to="/expenses">

            View All →

        </Link>

    }

/>

<ExpenseTable

    expenses={expenses.slice(0,3)}

    role={role}

    onDelete={() => {}}

/>

</Card>

</SplitLayout>



<PageSection

    title="Financial Analytics"

    subtitle="Revenue, expenses and spending insights."

>

<div className="finance-analytics-grid">

<Card>

<SectionHeader

    title="Expense Categories"

    subtitle="Distribution of expenses by category."

/>

<div className="finance-chart">

<ResponsiveContainer width="100%" height="100%">

<PieChart>

<Pie

data={expenseCategoryData}

dataKey="value"

nameKey="name"

outerRadius={100}

label={({ name, percent }) =>

`${name} ${(percent*100).toFixed(0)}%`

}

>

{expenseCategoryData.map((entry,index)=>(

<Cell

key={index}

fill={COLORS[index % COLORS.length]}

/>

))}

</Pie>

<Tooltip/>

</PieChart>

</ResponsiveContainer>

</div>

</Card>

<Card>

<SectionHeader

title="Revenue vs Expenses"

subtitle="Financial comparison."

/>

<div className="finance-chart">

<ResponsiveContainer width="100%" height="100%">

<BarChart

data={financeComparisonData}

>

<CartesianGrid

strokeDasharray="3 3"

/>

<XAxis

dataKey="name"

/>

<YAxis/>

<Tooltip/>

<Legend/>

<Bar

dataKey="Revenue"

radius={[8,8,0,0]}

/>

<Bar

dataKey="Expenses"

radius={[8,8,0,0]}

/>

</BarChart>

</ResponsiveContainer>

</div>

</Card>

</div>

</PageSection>
</>

);

}

export default Finance;