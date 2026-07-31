
import { Card, Button, Input } from "../Ui";
import "./ProductForm.css";

function ProductForm({
    formData,
    handleChange,
    handleSubmit,
    role,
}) {
    return (

<Card
    title="Add Product"
    subtitle="Register medicines, devices and consumables."
>
   <form 
   className="product-form"
   onSubmit={handleSubmit}>


<Input
    label="Product Name"
    name="name"
    value={formData.name}
    onChange={handleChange}
    placeholder="Paracetamol 500mg"
    required
/>

        <div className="product-form__grid">
          <Input
    label="Price"
    name="price"
    type="number"
    value={formData.price}
    onChange={handleChange}
    required
/>

<Input
    label="Stock Quantity"
    name="stock"
    type="number"
    value={formData.stock}
    onChange={handleChange}
    required
/>
          <Input
    label="Batch / LOT Number"
    name="batchNumber"
    value={formData.batchNumber}
    onChange={handleChange}
    required
/>

<Input
    label="Expiry Date"
    name="expiryDate"
    type="date"
    value={formData.expiryDate}
    onChange={handleChange}
    required
/>
        </div>
{(role === "Management" || role === "Supply Chain" || role === "Admin") && (
    <div className="product-form__actions">
<Button type="submit">

Add Product

</Button>
    </div>
)}
        
        </form>
      </Card>
   );
}
export default ProductForm;