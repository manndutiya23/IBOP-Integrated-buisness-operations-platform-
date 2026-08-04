import { useMemo, useState } from "react";

import { useBusinessData } from "../context/BusinessDataContext";
import { useAuth } from "../context/AuthContext";

import {

    PageHeader,

    PageSection,

} from "../components/Ui";

import {

    FinanceToolbar,

    ExpenseTable,

} from "../components/finance";

function Expenses() {

    const {

        expenses,

        deleteExpense,

    } = useBusinessData();

    const { user } = useAuth();

    const role = user?.role;

    const [searchTerm, setSearchTerm] =

        useState("");

    const [category, setCategory] =

        useState("All");

    const filteredExpenses = useMemo(() => {

        return expenses.filter(expense => {

            const matchesSearch =

                expense.title

                    ?.toLowerCase()

                    .includes(

                        searchTerm.toLowerCase()

                    );

            const matchesCategory =

                category === "All"

                ||

                expense.category === category;

            return (

                matchesSearch

                &&

                matchesCategory

            );

        });

    }, [

        expenses,

        searchTerm,

        category,

    ]);

    return (

        <>

            <PageHeader

                eyebrow="Finance"

                title="Expenses"

                subtitle="View and manage all recorded business expenses."

            />

            <PageSection

                title="Expense Records"

                subtitle="Search, filter and manage expenses."

            >

 <FinanceToolbar

    searchTerm={searchTerm}

    setSearchTerm={setSearchTerm}

    category={category}

    setCategory={setCategory}

    options={[

        "All",

        "Purchase",

        "Salaries",

        "Other",

    ]}

    searchPlaceholder="Search expenses..."

    addButtonText="+ Add Expense"

    addButtonLink="/finance"

/>
                <ExpenseTable

                    expenses={filteredExpenses}

                    role={role}

                    onDelete={deleteExpense}

                />

            </PageSection>

        </>

    );

}

export default Expenses;