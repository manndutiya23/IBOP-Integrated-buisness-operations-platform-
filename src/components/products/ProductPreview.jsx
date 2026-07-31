
import "./ProductPreview.css";
import { Card, EmptyState } from "../Ui";
import { Link } from "react-router-dom";
function ProductPreview({ products }) {

    return (

<Card
    title="Product Preview"
    subtitle="Latest inventory additions."
    actions={
        <Link to="/products/list">
            View All Products →
        </Link>
    }
>


        {products.length === 0 ? (
          <EmptyState

title="No Products"

description="Products you add will appear here."

actionLabel="Add Product"

/>
        ) : (
          <div className="product-preview__list">
            {products.slice(0, 3).map((product, index) => (
              <Card padding="compact"
              className="product-preview__item"
                key={product._id ?? `${product.name}-${index}`}               
              >
<h4>{product.name}</h4>

<p>₹{product.price}</p>

<p>{product.stock} units</p>
              </Card>
            ))}
          </div>
        )}
      </Card>
    );
}

export default ProductPreview;