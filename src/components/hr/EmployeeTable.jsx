import {

    Button,

    DataTable,

} from "../Ui";

import "./EmployeeTable.css";

function EmployeeTable({

    employees,

    role,

    onDelete,

}) {

    return (

        <DataTable>

            <thead>

                <tr>

                    <th>Name</th>

                    <th>Email</th>

                    <th>Role</th>

                    <th>Department</th>

                    <th>Phone</th>

                    <th>Salary</th>

                    <th>Joining Date</th>

                    {(role === "HR" ||

                    role === "Admin") && (

                        <th>Actions</th>

                    )}

                </tr>

            </thead>

            <tbody>

                {employees.length === 0 ? (

                    <tr>

                        <td

                            colSpan={
                                role === "HR" ||

                                role === "Admin"

                                    ? 8

                                    : 7
                            }

                            className="datatable__empty"

                        >

                            No employees found.

                        </td>

                    </tr>

                ) : (

                    employees.map((employee) => (

                        <tr key={employee._id}>

                            <td>

                                {employee.name}

                            </td>

                            <td>

                                {employee.email}

                            </td>

                            <td>

                                {employee.role}

                            </td>

                            <td>

                                {employee.department}

                            </td>

                            <td>

                                {employee.phone}

                            </td>

                            <td>

                                ₹{Number(

                                    employee.salary

                                ).toLocaleString()}

                            </td>

                            <td>

                                {employee.joiningDate

                                    ? new Date(

                                          employee.joiningDate

                                      ).toLocaleDateString()

                                    : "-"}

                            </td>

                            {(role === "HR" ||

                            role === "Admin") && (

                                <td>

                                    <Button

                                        variant="danger"

                                        size="sm"

                                        onClick={() =>

                                            onDelete(

                                                employee._id

                                            )

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

export default EmployeeTable;