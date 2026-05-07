import { useBusinessData } from "../context/BusinessDataContext";
import axios from "axios";
import { useState } from "react";

const Expenses = () => {
   const {
    expenses,
    deleteExpense,
    role,
  } = useBusinessData();
  return (
   
      <div className="bg-slate-900/80 p-6 rounded-3xl border border-white/10">
        <h3 className="text-white mb-4">Expenses</h3>
        <div className="mb-6">
  
</div>
        {expenses.length === 0 ? (
            <div>
          <p className="text-slate-400">No expenses yet</p>
        <p className="text-xs text-slate-500 mt-1">Add your first expense to get started</p>
        </div>
        ) : (
          expenses.map((e) => (
            <div key={e._id} className="flex justify-between border-b border-white/10 py-3">
              <div>
                <p>{e.title}</p>
                <p className="text-xs mt-1">
            <span
                className={`px-2 py-1 rounded text-xs ${
                e.category === "Purchase"
                    ? "bg-blue-500/20 text-blue-300"
                    : e.category === "Salaries"
                    ? "bg-purple-500/20 text-purple-300"
                    : "bg-gray-500/20 text-gray-300"
                }`}
            >
                {e.category}
            </span>

            <span className="text-slate-400 ml-2">• {new Date(e.date).toLocaleDateString()}</span>
            </p>
              </div>

              <div className="text-right">
                <p>₹{e.amount}</p>
                {(role === "Finance" || role === "Management") && (
                <button onClick={() => deleteExpense(e._id)} className="text-red-400 text-sm">
                  Delete
                </button>
                )}
              </div>
            </div>
          ))
          
        )}
      </div>
  )
}

export default Expenses