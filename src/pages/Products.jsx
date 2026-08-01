import { useState, useRef } from "react";
import { useBusinessData } from "../context/BusinessDataContext";
import API from "../utils/axiosConfig";
import { useAuth } from "../context/AuthContext";

import {
    PageHeader,
    PageSection,
} from "../components/Ui";

import {
    ProductKPIs,
    ProductToolbar,
    ProductTable,
    ProductForm,
} from "../components/products";

function Products() {

    const {
        products,
        addProduct,
    } = useBusinessData();

    const { user } = useAuth();

    const role = user?.role;
    const formRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        stock: "",
        batchNumber: "",
        expiryDate: "",
    });

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));

    };
    

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            const res = await API.post("/products", {
                name: formData.name.trim(),
                price: Number(formData.price),
                stock: Number(formData.stock),
                batchNumber: formData.batchNumber,
                expiryDate: formData.expiryDate,
            });

            addProduct(res.data);

            setFormData({
                name: "",
                price: "",
                stock: "",
                batchNumber: "",
                expiryDate: "",
            });

        } catch (error) {

            console.error(error);

            alert("Failed to add product");

        }

    };
const filteredProducts = products.filter((product) => {

    const matchesSearch =
        product.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

    let matchesStatus = true;

    if (statusFilter === "In Stock") {

        matchesStatus = product.stock > 10;

    } else if (statusFilter === "Low Stock") {

        matchesStatus =
            product.stock > 0 &&
            product.stock <= 10;

    } else if (statusFilter === "Out of Stock") {

        matchesStatus =
            product.stock === 0;

    }

    return (
        matchesSearch &&
        matchesStatus
    );

});
    return (

        <>

            <PageHeader
                eyebrow="Inventory"
                title="Products"
                subtitle="Manage medicines, devices and consumables across your inventory."
            />

            <ProductKPIs
                products={products}
            />

            <PageSection
                title="Inventory"
                subtitle="Search, filter and manage your inventory."
            >

                <ProductToolbar
                    searchTerm={searchTerm}
    setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
    setStatusFilter={setStatusFilter}
    onAddProduct={() =>
        formRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        })
    }
/>

                <ProductTable
                   products={filteredProducts}
                    role={role}
                />

            </PageSection>
<div ref={formRef}>
            <PageSection
                title="Add Product"
                subtitle="Register new medicines, devices and consumables."
            >

                <ProductForm
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    role={role}
                />

            </PageSection>
</div>
        </>

    );

}

export default Products;