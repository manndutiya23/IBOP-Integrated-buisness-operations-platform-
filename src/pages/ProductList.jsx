import { useBusinessData } from "../context/BusinessDataContext";
import { useState } from "react";


function ProductList() {
const { products, deleteProduct, updateProduct, role } = useBusinessData();
const [editingId, setEditingId] = useState(null);
const [editData, setEditData] = useState({ price: "", stock: "" });
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
      <h3 className="text-lg font-semibold text-white">Product List</h3>

      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
        <h3 className="text-lg font-semibold text-white">Current product list</h3>
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
        {products.length === 0 ? (
        <p className="text-slate-400 text-center mt-6">
          No products yet. Add your first product.
        </p>
      ) : (
          <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-200">
            <thead className="bg-white/5 text-slate-300 w-full ">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>                
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Batch / LOT No</th>
                <th className="px-4 py-3 font-medium">Expiry Date</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-white/5">
                  <td className="px-4 py-4">{product.name}</td>
                    
                <td>
                  {editingId === product._id ? (
                    <input
                      type="number"
                      value={editData.price}
                      onChange={(e) =>
                        setEditData({ ...editData, price: e.target.value })
                      }
                      className="bg-slate-800 px-2 py-1 rounded"
                    />
                  ) : (
                    `₹${product.price.toFixed(2)}`
                  )}
                </td>

                <td>
                  {editingId === product._id ? (
                    <input
                      type="number"
                      value={editData.stock}
                      onChange={(e) =>
                        setEditData({ ...editData, stock: e.target.value })
                      }
                      className="bg-slate-800 px-2 py-1 rounded"
                    />
                  ) : (
                    product.stock
                  )}
                </td>
                <td className="px-4 py-4">{product.batch}</td>
                <td className="px-4 py-4">  {new Date(product.expiryDate).toLocaleDateString()}</td>
<td className="px-4 py-4">
  <div className="flex flex-col items-end gap-1">
{(role === "Management" || role === "Supply Chain") && (
    editingId === product._id ? (
      
      <button
  onClick={async () => {
  try {
    await updateProduct({
      _id: product._id,
      price: Number(editData.price),
      stock: Number(editData.stock),
    });

    setEditingId(null);
  

  } catch (err) {
    console.error(err);
    alert("Update failed");
  }
}}
        className="text-emerald-300 hover:text-emerald-200"
      >
        Save
      </button>
    ) : (

      <button
        onClick={() => {
          setEditingId(product._id);
          setEditData({
            price: product.price,
            stock: product.stock,
          });
        }}
        className="text-yellow-300 hover:text-yellow-200"
      >
        Edit
      </button>
    )
)}
{(role === "Management" || role === "Supply Chain") && (
    <button
      onClick={() => deleteProduct(product._id)}
      className="text-red-400 hover:text-red-300"
    >
      Delete
    </button>
)}
  </div>
</td>
      </tr>
                
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductList;