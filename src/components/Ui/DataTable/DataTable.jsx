import "./DataTable.css";

function DataTable({

    children,

}) {

    return (

        <div className="datatable">

            <table className="datatable__table">

                {children}

            </table>

        </div>

    );

}

export default DataTable;