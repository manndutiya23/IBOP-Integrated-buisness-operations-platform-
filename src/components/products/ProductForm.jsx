import { Card, Button, Input } from "../Ui";
import "./ProductForm.css";

function ProductForm({ formData, handleChange, handleSubmit }) {
  return (
    <Card
      title="Product Master Details"
      subtitle="Fields describe the product itself, not a specific stock batch."
    >
      <form className="product-form" onSubmit={handleSubmit}>
        <div className="product-form__grid">
          <Input label="Product Code" name="productCode" value={formData.productCode} onChange={handleChange} placeholder="e.g. 11760" required />
          <Input label="Product Name" name="name" value={formData.name} onChange={handleChange} placeholder="Full catalogue product name" required />
          <Input label="Nickname" name="nick" value={formData.nick} onChange={handleChange} placeholder="Short name / search alias" />
          <Input label="Manufacturer / Division" name="manufacturerDivision" value={formData.manufacturerDivision} onChange={handleChange} placeholder="Manufacturer or division" />
          <Input label="Product Type" name="productType" value={formData.productType} onChange={handleChange} placeholder="e.g. Tablet, Syrup, Surgical" />
          <Input label="HSN Code" name="hsnCode" value={formData.hsnCode} onChange={handleChange} placeholder="HSN / SAC code" />
          <Input label="IGST Rate (%)" name="igstRate" type="number" min="0" step="0.01" value={formData.igstRate} onChange={handleChange} placeholder="0.00" />
          <Input label="CGST Rate (%)" name="cgstRate" type="number" min="0" step="0.01" value={formData.cgstRate} onChange={handleChange} placeholder="0.00" />
          <Input label="SGST Rate (%)" name="sgstRate" type="number" min="0" step="0.01" value={formData.sgstRate} onChange={handleChange} placeholder="0.00" />
        </div>
        <p className="product-form__note">
          Stock quantity, batch number, expiry date and purchase price are intentionally excluded here. They belong to received inventory batches and procurement records.
        </p>
        <div className="product-form__actions">
          <Button type="submit">Save Product</Button>
        </div>
      </form>
    </Card>
  );
}

export default ProductForm;
