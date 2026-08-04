import {

    Button,

    Card,

    Input,

    SectionHeader,

    Select,

} from "../Ui";

import "./EmployeeForm.css";

function EmployeeForm({

    form,

    handleChange,

    handleSubmit,

}) {

    return (

        <Card>

            <SectionHeader

                title="Add Employee"

                subtitle="Create a new employee record."

            />

            <form

                onSubmit={handleSubmit}

                className="employee-form"

            >

                <div className="employee-form__grid">

                    <div className="ibop-input-group">

                        <label>

                            Name

                        </label>

                        <Input

                            name="name"

                            value={form.name}

                            onChange={handleChange}

                            placeholder="Enter employee name"

                            required

                        />

                    </div>

                    <div className="ibop-input-group">

                        <label>

                            Email

                        </label>

                        <Input

                            type="email"

                            name="email"

                            value={form.email}

                            onChange={handleChange}

                            placeholder="Enter email"

                            required

                        />

                    </div>

                    <div className="ibop-select-group">

                        <label>

                            Role

                        </label>

                        <Select

                            name="role"

                            value={form.role}

                            onChange={handleChange}

                            required

                        >

                            <option value="">

                                Select Role

                            </option>

                            <option value="Admin">

                                Admin

                            </option>

                            <option value="Management">

                                Management

                            </option>

                            <option value="Finance">

                                Finance

                            </option>

                            <option value="Sales">

                                Sales

                            </option>

                            <option value="Supply Chain">

                                Supply Chain

                            </option>

                            <option value="HR">

                                HR

                            </option>

                        </Select>

                    </div>

                    <div className="ibop-input-group">

                        <label>

                            Department

                        </label>

                        <Input

                            name="department"

                            value={form.department}

                            onChange={handleChange}

                            placeholder="Department"

                            required

                        />

                    </div>

                    <div className="ibop-input-group">

                        <label>

                            Salary

                        </label>

                        <Input

                            type="number"

                            name="salary"

                            value={form.salary}

                            onChange={handleChange}

                            placeholder="Salary"

                            required

                        />

                    </div>

                    <div className="ibop-input-group">

                        <label>

                            Phone

                        </label>

                        <Input

                            name="phone"

                            value={form.phone}

                            onChange={handleChange}

                            placeholder="Phone Number"

                            required

                        />

                    </div>

                    <div className="ibop-input-group">

                        <label>

                            Joining Date

                        </label>

                        <Input

                            type="date"

                            name="joiningDate"

                            value={form.joiningDate}

                            onChange={handleChange}

                            required

                        />

                    </div>

                </div>

                <div className="employee-form__actions">

                    <Button

                        type="submit"

                    >

                        Add Employee

                    </Button>

                </div>

            </form>

        </Card>

    );

}

export default EmployeeForm;