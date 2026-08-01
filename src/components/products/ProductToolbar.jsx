import "./ProductToolbar.css";
import { Button, Input, Select } from "../Ui";

function ProductToolbar({
    searchTerm,
    setSearchTerm,
      statusFilter,
    setStatusFilter,
      onAddProduct,

}) {

    return (

        <div className="product-toolbar">

            <div className="product-toolbar__left">

                <Input
                    placeholder="Search products..."
                        value={searchTerm}
    onChange={(event) =>
        setSearchTerm(event.target.value)
    }
                />

                <Select     value={statusFilter}

    onChange={(event) =>
        setStatusFilter(
            event.target.value
        )
    }>

                    <option value="">
                        All Categories
                    </option>

                    <option>
                        Medicines
                    </option>

                    <option>
                        Devices
                    </option>

                    <option>
                        Consumables
                    </option>

                </Select>

                <Select defaultValue="">

                    <option value="">
                        All Status
                    </option>

                    <option>
                        In Stock
                    </option>

                    <option>
                        Low Stock
                    </option>

                    <option>
                        Out of Stock
                    </option>

                </Select>

            </div>

            <div className="product-toolbar__right">

                <Button
                    onClick={onAddProduct}
                >
                    + Add Product
                </Button>

            </div>

        </div>

    );

}

export default ProductToolbar;