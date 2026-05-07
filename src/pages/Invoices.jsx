import { useBusinessData } from "../context/BusinessDataContext";
import { jsPDF } from "jspdf";
import { generateInvoicePDF } from "../utils/pdfGenerator";

function Invoices() {
  const { invoices, createInvoice } = useBusinessData();
  const handleCreateInvoice = (sale) => {
  createInvoice(sale);
};

  console.log("Invoices Page Invoices:", invoices);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Finance</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">Invoices</h2>
      </div>

      <div className="space-y-4">
        {(!invoices || invoices.length === 0) ? (
          <p className="text-slate-400">No invoices yet</p>
        ) : (
          <div className="grid gap-4">
            {invoices.map((invoice) => (
              <div
                key={invoice._id}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="text-sm text-slate-300">Invoice ID</div>
                  <div className="text-sm text-slate-300">Company</div>
                </div>

                <div className="flex justify-between items-center mt-1">
                  <div className="text-white font-medium">{"INV-" + (invoice._id || "").slice(-6)}</div>
                  <div className="text-white font-medium">{invoice.companyName || "-"}</div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-slate-300">
                  <div>
                    <div className="text-xs">Product</div>
                    <div className="text-white">{invoice.productName || "-"}</div>
                  </div>

                  <div>
                    <div className="text-xs">Quantity</div>
                    <div className="text-white">{invoice.quantity || 0}</div>
                  </div>

                  <div>
                    <div className="text-xs">Final amount</div>
                    <div className="text-white">Rs{(invoice.finalAmount || 0).toFixed ? (invoice.finalAmount || 0).toFixed(2) : invoice.finalAmount}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-slate-300">
                    {invoice.date ? new Date(invoice.date).toLocaleDateString() : "-"}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                    
                      className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                    >
                      View
                    </button>

                    <button
                     onClick={() => generateInvoicePDF(invoice)}
                      className="rounded-full bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Invoices;
