import { useBusinessData } from "../context/BusinessDataContext";
import { generateInvoicePDF } from "../utils/pdfGenerator";
import { useState } from "react";

function Invoices() {
  const { invoices, toggleInvoiceStatus } = useBusinessData();
  const [selectedInvoice, setSelectedInvoice] = useState(null);

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
                className="bg-gradient-to-br from-slate-900/90 to-slate-800/60 border border-white/10 rounded-2xl p-5 hover:border-emerald-400/30 hover:bg-white/[0.07] transition-all duration-300 shadow-xl"
              >
                <div className="flex justify-between items-start">
                  <div className="text-sm text-slate-300">Invoice ID</div>
                  <div className="text-sm text-slate-300">Company</div>
                </div>

                <div className="flex justify-between items-center mt-1">
                  <div className="text-white font-semibold tracking-wide">{"INV-" + (invoice._id || "").slice(-6)}</div>
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
   <div className="flex items-center gap-4">
  <div className="text-sm text-slate-300">
    {invoice.date ? new Date(invoice.date).toLocaleDateString() : "-"}
  </div>

  <div className="flex items-center gap-2">
    <div
      className={`h-2.5 w-2.5 rounded-full ${
        invoice.status === "paid"
          ? "bg-emerald-400"
          : invoice.status === "overdue"
          ? "bg-red-500"
          : "bg-yellow-400"
      }`}
    />

    <span className="text-xs uppercase tracking-wider text-slate-400">
      {invoice.status}
    </span>
  </div>
</div>

                  <div className="flex items-center gap-3">
          <button
  onClick={() => setSelectedInvoice(invoice)}
  className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
>
  View
</button>
<button
  onClick={() => toggleInvoiceStatus(invoice._id)}
  className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-200 hover:scale-105 ${
    invoice.status === "paid"
      ? "bg-emerald-400/90 text-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-300"
      : invoice.status === "overdue"
      ? "bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-400"
      : "bg-yellow-400 text-black shadow-lg shadow-yellow-500/20 hover:bg-yellow-300"
  }`}
>
  {invoice.status?.toUpperCase()}
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
      {selectedInvoice && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
    
    <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
            Invoice Preview
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            INV-{selectedInvoice._id.slice(-6)}
          </h2>
        </div>

        <button
          onClick={() => setSelectedInvoice(null)}
          className="rounded-full bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
        >
          Close
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        
        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-xs uppercase text-slate-400">Company</p>
          <p className="mt-1 text-white">
            {selectedInvoice.companyName}
          </p>
        </div>

        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-xs uppercase text-slate-400">Status</p>

          <p
            className={`mt-1 font-semibold ${
              selectedInvoice.status === "paid"
                ? "text-emerald-400"
                : "text-yellow-400"
            }`}
          >
            {selectedInvoice.status.toUpperCase()}
          </p>
        </div>

        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-xs uppercase text-slate-400">Product</p>
          <p className="mt-1 text-white">
            {selectedInvoice.productName}
          </p>
        </div>

        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-xs uppercase text-slate-400">Quantity</p>
          <p className="mt-1 text-white">
            {selectedInvoice.quantity}
          </p>
        </div>

      </div>

      <div className="mt-6 rounded-2xl bg-white/5 p-5">
        
        <div className="flex justify-between text-slate-300">
          <span>Subtotal</span>
          <span>₹{selectedInvoice.subtotal?.toFixed(2)}</span>
        </div>

        <div className="mt-3 flex justify-between text-slate-300">
          <span>GST (18%)</span>
          <span>₹{selectedInvoice.gst?.toFixed(2)}</span>
        </div>

        <div className="mt-4 flex justify-between border-t border-white/10 pt-4 text-lg font-semibold text-white">
          <span>Total</span>
          <span>₹{selectedInvoice.finalAmount?.toFixed(2)}</span>
        </div>

      </div>

      <div className="mt-6 flex items-center justify-between">
        
        <div className="text-sm text-slate-400">
          Due:{" "}
          {selectedInvoice.dueDate
            ? new Date(selectedInvoice.dueDate).toLocaleDateString()
            : "-"}
        </div>

        <button
          onClick={() => generateInvoicePDF(selectedInvoice)}
          className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
        >
          Download PDF
        </button>

      </div>

    </div>

  </div>
)}
    </section>
  );
}

export default Invoices;
