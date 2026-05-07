import { Link } from "react-router-dom";
import { useState } from "react";
import { useBusinessData } from "../context/BusinessDataContext";
import {jsPDF} from "jspdf";
import letterhead from "../assets/letterhead.png";
import { generateInvoicePDF } from "../utils/pdfGenerator";

const Sales = () => {
  const { sales, deleteSale, createInvoice, role } = useBusinessData();
  const [selectedSale, setSelectedSale] = useState(null);
console.log(sales);

  
  const handlePrint = () => {
    window.print();
  };

const handleCreateInvoiceClick = async (sale) => {
  try {
    await createInvoice({
      saleId: sale._id,
      companyName: sale.companyName,
      productName: sale.productName,
      quantity: sale.quantity,
      rate: sale.rate,
      totalPrice: sale.totalPrice,
      finalAmount: sale.finalAmount,
      date: sale.date
    });

    setSelectedSale(sale); // open modal AFTER saving
  } catch (error) {
    console.error("Invoice creation failed:", error);
  }
};

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Sales</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">Sales records</h2>
        </div>
{(role === "Sales" || role === "Management") && (
        <Link
          to="/sales/new"
          className="rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          Create sale
        </Link>
        )}
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl shadow-black/20">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="bg-white/5 text-slate-300">
            <tr >
              {[
                "Company",
                "Product",
                "Quantity",
                "Rate",
                "Total",
                "Discount",
                "Final Amount",
                "Salesperson",
                "Date",
                "Actions"
              ].map((header) => (
                <th key={header} className="px-4 py-3 font-medium">
                  {header}
                </th>
                
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-slate-200">
            {sales.length === 0 ? (
          <tr>
            <td colSpan="10" className="px-4 py-10 text-center text-slate-400">
              <div className="flex flex-col items-center gap-2 justify-center">
                <p className="text-lg text-white">No sales yet</p>
                <p className="text-sm">Add new sales</p>
                {(role === "Sales" || role === "Management") && (
                <Link
                  to="/sales/new"
                  className="mt-2 px-4 py-2 rounded-full bg-emerald-400 text-slate-900 text-sm font-semibold"
                >
                  Create Sale
                </Link>
                )}
              </div>
            </td>
          </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale._id} className="hover:bg-white/5">
                  <td className="px-4 py-4">{sale.companyName || "-"}</td>
                  <td className="px-4 py-4">{sale.productName || "N/A"}</td>
                  <td className="px-4 py-4">{sale.quantity || 0}</td>
                  <td className="px-4 py-4">Rs{(sale.rate || 0).toFixed(2)}</td>
                  <td className="px-4 py-4">Rs{(sale.totalPrice || 0).toFixed(2)}</td>
                  <td className="px-4 py-4">{sale.discount}%</td>
                  <td className="px-4 py-4 font-semibold text-emerald-300">
                    Rs{(sale.finalAmount || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-4">{sale.salesperson || "-"}</td>
                <td className="px-4 py-4">{sale.date 
  ? new Date(sale.date).toLocaleDateString() 
  : "-"}</td>
  
                <td className="text-right">
  <div className="flex flex-col gap-1 text-center items-center justify-center">
    {(role === "Sales" || role === "Management") && (
   <button
      onClick={() => handleCreateInvoiceClick(sale)}
      className="text-emerald-400 text-sm hover:text-emerald-300"
    >
      Invoice
    </button>
    )}
    {(role === "Sales" || role === "Management") && (
    <button
      onClick={() => deleteSale(sale._id)}
      className="text-red-400 text-sm hover:text-red-300"
    >
      Delete
    </button>
    )}
  </div>
</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedSale(null)} />
          <div className="relative z-10 w-[90%] max-w-2xl rounded-2xl bg-slate-900/95 p-6 border border-white/10 shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-4">Invoice</h3>
            <div className="space-y-2 text-sm text-slate-200">
              <div className="flex justify-between">
                <span>Company</span>
                <span className="font-medium text-white">{selectedSale.companyName || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span>Product</span>
                <span className="font-medium text-white">{selectedSale.productName || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span>Quantity</span>
                <span className="font-medium text-white">{selectedSale.quantity || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Rate</span>
                <span className="font-medium text-white">Rs{(selectedSale.rate || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Price</span>
                <span className="font-medium text-white">Rs{(selectedSale.totalPrice || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Final Amount</span>
                <span className="font-medium text-emerald-300">Rs{(selectedSale.finalAmount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Date</span>
                <span className="font-medium text-white">{selectedSale.date ? new Date(selectedSale.date).toLocaleDateString() : "-"}</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => generateInvoicePDF(selectedSale)}
                  className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                >
                  Download PDF
                </button>
                <button
                  onClick={handlePrint}
                  className="rounded-full bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
                >
                  Print
                </button>
                <button
                  onClick={() => setSelectedSale(null)}
                  className="rounded-full bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Sales