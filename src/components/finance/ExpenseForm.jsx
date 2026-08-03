import {
    Button,
    Card,
    Input,
    SectionHeader,
    Select,
} from "../Ui";

import "./ExpenseForm.css";

function ExpenseForm({

    form,

    handleChange,

    handleSubmit,

}) {

    return (

        <Card>

            <SectionHeader

                title="Add Expense"

                subtitle="Record a new business expense."

            />

            <form

                onSubmit={handleSubmit}

                className="expense-form"

            >

                <div className="expense-form__grid">

                    <div className="ibop-input-group">

                        <label>

                            Expense Title

                        </label>

                        <Input

                            name="title"

                            value={form.title}

                            onChange={handleChange}

                            placeholder="Enter expense title"

                            required

                        />

                    </div>

                    <div className="ibop-input-group">

                        <label>

                            Amount

                        </label>

                        <Input

                            type="number"

                            name="amount"

                            value={form.amount}

                            onChange={handleChange}

                            placeholder="₹0"

                            required

                        />

                    </div>

                    <div className="ibop-input-group">

                        <label>

                            Category

                        </label>

                        <Select

                            name="category"

                            value={form.category}

                            onChange={handleChange}

                        >

                            <option value="Purchase">

                                Purchase

                            </option>

                            <option value="Salaries">

                                Salaries

                            </option>

                            <option value="Other">

                                Other

                            </option>

                        </Select>

                    </div>

                    <div className="ibop-input-group">

                        <label>

                            Date

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

                <div className="expense-form__actions">

                    <Button

                        type="submit"

                    >

                        Add Expense

                    </Button>

                </div>

            </form>

        </Card>

    );

}

export default ExpenseForm;