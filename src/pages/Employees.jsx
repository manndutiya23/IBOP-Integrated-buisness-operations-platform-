import { useBusinessData } from "../context/BusinessDataContext";
import { useAuth } from "../context/AuthContext";

const Employees = () => {
  const { employees, deleteEmployee } = useBusinessData();
  const { user } = useAuth();
  const role = user?.role;

  return (
      <div className="bg-slate-900/80 p-6 rounded-3xl border border-white/10">
        <h3 className="text-white mb-4">Employees</h3>

        {employees.length === 0 ? (
          <p className="text-slate-400">No employees yet</p>
        ) : (
          employees.map((e) => (
            <div
              key={e._id}
              className="flex justify-between border-b border-white/10 py-3"
            >
              <div>
                <p>{e.name}</p>
                <p className="text-xs text-slate-400">
                  {e.role} • {e.phone} • {e.email}
                </p>
              </div>
            {(role === "HR" || role === "Admin") && (
              <button
                onClick={() => deleteEmployee(e._id)}
                className="text-red-400 text-sm"
              >
                Delete
              </button>
            )}
            </div>
          ))
        )}
      </div>

  )
}

export default Employees