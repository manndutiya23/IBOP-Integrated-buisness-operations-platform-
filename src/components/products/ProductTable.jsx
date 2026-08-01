import { useState } from "react";
import { useBusinessData } from "../../context/BusinessDataContext";
import {
    Button,
    DataTable,
    PageSection,
    StatusBadge,
    Input,
} from "../Ui";

import "./ProductTable.css";

function ProductTable({ products }) {

    const {

        updateProduct,
        deleteProduct,

    } = useBusinessData();

    const [editingId, setEditingId] = useState(null);

    const [editData, setEditData] = useState({

        price: "",

        stock: "",

    });

    const startEditing = (product) => {

        setEditingId(product._id);

        setEditData({

            price: product.price,

            stock: product.stock,

        });

    };

    const cancelEditing = () => {

        setEditingId(null);

    };

    const saveProduct = async (product) => {

        await updateProduct({

            _id: product._id,

            price: Number(editData.price),

            stock: Number(editData.stock),

        });

        setEditingId(null);

    };

    const getStatus = (stock) => {

        if (stock === 0) {

            return {

                variant: "danger",

                label: "Out of Stock",

            };

        }

        if (stock <= 10) {

            return {

                variant: "warning",

                label: "Low Stock",

            };

        }

        return {

            variant: "success",

            label: "In Stock",

        };

    };

    return (

        <PageSection

            title="Inventory"

            subtitle="Manage products currently available in stock."

        >

            <DataTable>

                <thead>

                    <tr>

                        <th>Product</th>

                        <th>Price</th>

                        <th>Stock</th>

                        <th>Batch</th>

                        <th>Expiry</th>

                        <th>Status</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>
                                        {products.length === 0 ? (

                        <tr>

                            <td
                                colSpan="7"
                                className="datatable__empty"
                            >

                                No products found.

                            </td>

                        </tr>

                    ) : (

                        products.map((product) => {

                            const status = getStatus(
                                Number(product.stock)
                            );

                            return (

                                <tr
                                    key={product._id}
                                >

                                    <td>

                                        {product.name}

                                    </td>

                                    <td>

                                        {editingId === product._id ? (

                                            <Input
                                                type="number"
                                                value={editData.price}
                                                onChange={(event) =>
                                                    setEditData({
                                                        ...editData,
                                                        price:
                                                            event.target.value,
                                                    })
                                                }
                                            />

                                        ) : (

                                            <>₹{Number(product.price).toLocaleString()}</>

                                        )}

                                    </td>

                                    <td>

                                        {editingId === product._id ? (

                                            <Input
                                                type="number"
                                                value={editData.stock}
                                                onChange={(event) =>
                                                    setEditData({
                                                        ...editData,
                                                        stock:
                                                            event.target.value,
                                                    })
                                                }
                                            />

                                        ) : (

                                            <>{product.stock}</>

                                        )}

                                    </td>

                                    <td>

                                        {product.batchNumber}

                                    </td>

                                    <td>

                                        {new Date(
                                            product.expiryDate
                                        ).toLocaleDateString()}

                                    </td>

                                    <td>

                                        <StatusBadge
                                            variant={status.variant}
                                        >

                                            {status.label}

                                        </StatusBadge>

                                    </td>

                                    <td>

                                        {editingId === product._id ? (

                                            <>

                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        saveProduct(product)
                                                    }
                                                >
                                                    Save
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={
                                                        cancelEditing
                                                    }
                                                >
                                                    Cancel
                                                </Button>

                                            </>

                                        ) : (

                                            <>

                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() =>
                                                        startEditing(product)
                                                    }
                                                >
                                                    Edit
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={() =>
                                                        deleteProduct(
                                                            product._id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </Button>

                                            </>

                                        )}

                                    </td>

                                </tr>

                            );

                        })

                    )}

                </tbody>

            </DataTable>

        </PageSection>

    );

}

export default ProductTable;