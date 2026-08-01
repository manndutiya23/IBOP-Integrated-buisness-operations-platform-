import { useState } from "react";
import { useBusinessData } from "../context/BusinessDataContext"; 
import API from "../utils/axiosConfig";
import { useAuth } from "../context/AuthContext";
import {
    Button,
    PageHeader,
    SplitLayout,
} from "../components/Ui";
import {
    ProductForm,
    ProductPreview,
    ProductKPIs,
} from "../components/products";

function Products() {
  const { products, addProduct } = useBusinessData();
  const { user } = useAuth();
  const role = user?.role;
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    batchNumber: "",
    expiryDate: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentForm) => ({
      ...currentForm,
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

// 🔥 update UI instantly
addProduct(res.data);

// reset form
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
        <SplitLayout
            left={
                <ProductForm
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    role={role}
                />
            }
            right={
                <ProductPreview
                    products={products}
                />
            }
        />
    </>
);
}

export default Products;