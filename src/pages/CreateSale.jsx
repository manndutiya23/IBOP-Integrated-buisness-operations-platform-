import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBusinessData } from "../context/BusinessDataContext";
import { useAuth } from "../context/AuthContext";
import API from "../utils/axiosConfig";
import "./CreateSale.css";

import {
    Button,
    Card,
    Input,
    PageHeader,
    SectionHeader,
    Select,
    SplitLayout,
} from "../components/Ui";

function CreateSale() {
  const navigate = useNavigate();
  const { products } = useBusinessData();
  const { user } = useAuth();
  const role = user?.role;
  const [formData, setFormData] = useState({
    companyName: "",
    productId: products[0]?._id ?? products[0]?.id ?? "",
    quantity: 1,
    rate: products[0]?.price ?? 0,
    discount: 0,
    salesperson: "",
    date: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const total = Number(formData.quantity || 0) * Number(formData.rate || 0);
  const discountAmount = total * (Number(formData.discount || 0) / 100);
  const finalAmount = total - discountAmount;

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "productId") {
   const product = products.find((item) => item._id === value);

      setFormData((currentForm) => ({
        ...currentForm,
        productId: String(value),
        rate: product?.price ?? currentForm.rate,
      }));
      return;
    }

    setFormData((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

const handleSubmit = async (event) => {
  
  setErrorMessage("");

  const quantity = Number(formData.quantity || 0);
  const rate = Number(formData.rate || 0);
  const totalPrice = quantity * rate;
  const discount = Number(formData.discount || 0);
  const discountAmount = totalPrice * (discount / 100);
  const finalAmount = totalPrice - discountAmount;

  const payload = {
    companyName: formData.companyName.trim(),
    productId: String(formData.productId),
    quantity,
    rate,
    totalPrice,
    discount,
    finalAmount,
    salesperson: formData.salesperson.trim(),
    date: new Date(formData.date),
  };

  try {
    console.log("PAYLOAD:", payload);
    await API.post("/sales", payload);
    navigate("/sales/new");
  } catch (err) {
    console.error("ERROR:", err.response?.data || err.message);
    setErrorMessage("Failed to create sale");
  }
};

return (

<>

<PageHeader

    eyebrow="Sales"

    title="Create Sale"

    subtitle="Create a new sales order and automatically calculate totals."

/>

<SplitLayout

leftWidth="2fr"

rightWidth="1fr"

>

<Card>

<SectionHeader

title="Create Sale"

subtitle="Enter customer and product information."

/>

{(role === "Sales" ||
role === "Management" ||
role === "Admin") && (

<form onSubmit={handleSubmit}>

<div className="product-form__grid">

  <div className="ibop-input-group">

<label>

Company

</label>

<Select

name="companyName"

value={formData.companyName}

onChange={handleChange}

required

>

<option value="">

Select Company

</option>

{[

"Mahesh Pharma",

"Apollo",

"Sun Pharma",

].map(company=>(

<option

key={company}

value={company}

>

{company}

</option>

))}

</Select>

</div>
 <div className="ibop-input-group">

<label>

Product

</label>

<Select

name="productId"

value={formData.productId}

onChange={handleChange}

required

>

{products.map(product=>(

<option

key={product._id}

value={product._id}

>

{product.name}

({product.stock} in stock)

</option>

))}

</Select>

</div>
<div className="ibop-input-group">

<label>

Quantity

</label>

<Input

type="number"

name="quantity"

value={formData.quantity}

onChange={handleChange}

min="1"

required

/>

</div>
 <div className="ibop-input-group">

<label>

Rate

</label>

<Input

type="number"

name="rate"

value={formData.rate}

readOnly

/>

</div>
 <div className="ibop-input-group">

<label>

Discount %

</label>

<Input

type="number"

name="discount"

value={formData.discount}

onChange={handleChange}

min="0"

max="100"

step="0.01"

/>

</div>
        </div>
 <div className="ibop-input-group">

<label>

Salesperson

</label>

<Input

name="salesperson"

value={formData.salesperson}

onChange={handleChange}

required

/>

</div>
<div className="ibop-input-group">

<label>

Date

</label>

<Input

type="date"

name="date"

value={formData.date}

onChange={handleChange}

required

/>

</div>
        {

errorMessage && (

<p className="ibop-form-error">

{errorMessage}

</p>

)

}

        <div className="product-form__actions">

<Button

type="submit"

>

Save Sale

</Button>

</div>
      </form>
      )}
      </Card>
<Card>

<SectionHeader

title="Sale Summary"

subtitle="Review the calculated totals before saving."

/>

<div className="sale-summary">

<div className="sale-summary__row">

<span>

Total

</span>

<strong>

₹{total.toFixed(2)}

</strong>

</div>

<div className="sale-summary__row">

<span>

Discount

</span>

<strong>

- ₹{discountAmount.toFixed(2)}

</strong>

</div>

<div className="sale-summary__row sale-summary__row--total">

<span>

Final Amount

</span>

<strong>

₹{finalAmount.toFixed(2)}

</strong>

</div>

</div>

<div className="sale-summary__info">

<p>

Selected product stock will automatically decrease after this sale is saved.

</p>

</div>

</Card>

</SplitLayout>

</>

);
}

export default CreateSale;