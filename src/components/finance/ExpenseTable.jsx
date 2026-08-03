import { Button, DataTable } from "../Ui";
import "./ExpenseTable.css";

function ExpenseTable({

    expenses,

    onDelete,

    role,

}) {

    return (

        <DataTable>

            <thead>

                <tr>

                    <th>Title</th>

                    <th>Category</th>

                    <th>Amount</th>

                    <th>Date</th>

                    {(role === "Finance" ||
                        role === "Management" ||
                        role === "Admin") && (

                        <th>Actions</th>

                    )}

                </tr>

            </thead>

            <tbody>

                {expenses.length === 0 ? (

                    <tr>

                        <td
                            colSpan={
                                role === "Finance" ||
                                role === "Management" ||
                                role === "Admin"
                                    ? 5
                                    : 4
                            }
                            className="datatable__empty"
                        >

                            No expenses found.

                        </td>

                    </tr>

                ) : (

                    expenses.map((expense) => (

                        <tr key={expense._id}>

                            <td>

                                {expense.title}

                            </td>

                            <td>

                                <span
                                    className={`expense-category expense-category--${expense.category.toLowerCase()}`}
                                >

                                    {expense.category}

                                </span>

                            </td>

                            <td>

                                ₹{Number(
                                    expense.amount
                                ).toLocaleString()}

                            </td>

                            <td>

                                {new Date(
                                    expense.date
                                ).toLocaleDateString()}

                            </td>

                            {(role === "Finance" ||
                                role === "Management" ||
                                role === "Admin") && (

                                <td>

                                    <Button

                                        variant="danger"

                                        size="sm"

                                        onClick={() =>
                                            onDelete(expense._id)
                                        }

                                    >

                                        Delete

                                    </Button>

                                </td>

                            )}

                        </tr>

                    ))

                )}

            </tbody>

        </DataTable>

    );

}

export default ExpenseTable;