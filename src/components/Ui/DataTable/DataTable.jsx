import "./DataTable.css";
import EmptyState from "../EmptyState/EmptyState";

function DataTable({
    columns = [],
    rows = [],
    emptyTitle = "No data found",
    emptyDescription = "There is nothing to display yet.",
}) {
    return (
        <div className="datatable">

            <table className="datatable__table">

                <thead>

                    <tr>

                        {columns.map((column) => (

                            <th
                                key={column.accessor ?? column.header}
                            >
                                {column.header}
                            </th>

                        ))}

                    </tr>

                </thead>

                <tbody>

                    {rows.length === 0 ? (

                        <tr>

                            <td
                                colSpan={columns.length}
                                className="datatable__empty"
                            >

                                <EmptyState
                                    title={emptyTitle}
                                    description={emptyDescription}
                                />

                            </td>

                        </tr>

                    ) : (

                        rows.map((row, index) => (

                            <tr
                                key={row._id ?? index}
                            >

                                {columns.map((column) => (

                                    <td
                                        key={column.accessor ?? column.header}
                                    >

                                        {column.render
                                            ? column.render(row)
                                            : row[column.accessor]}

                                    </td>

                                ))}

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>
    );
}

export default DataTable;