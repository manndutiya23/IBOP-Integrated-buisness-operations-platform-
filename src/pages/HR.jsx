import { useState } from "react";
import { useBusinessData } from "../context/BusinessDataContext";
import { Link } from "react-router-dom";

function HR() {
  const { addEmployee, role } = useBusinessData();

  const [form, setForm] = useState({
  name: "",
  email: "",
  role: "",
  department: "",
  salary: "",
  phone: "",
  joiningDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!form.name || !form.role || !form.department || !form.salary || !form.phone || !form.joiningDate) return;

    await addEmployee({
  ...form,
  salary: Number(form.salary),
});

    setForm({
  name: "",
  email: "",
  role: "",
  department: "",
  salary: "",
  phone: "",
  joiningDate: "",
});
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">

      {/* FORM */}
      {(role === "HR" || role === "Management") && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white/5 p-6 rounded-3xl border border-white/10"
        >
          <h2 className="text-2xl text-white">Add Employee</h2>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-3 bg-slate-900 rounded-xl"
          required
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-3 bg-slate-900 rounded-xl"
          required
        />
<select
  name="role"
  value={form.role}
  onChange={handleChange}
  className="w-full rounded-xl bg-slate-900 p-3"
  required
>
  <option value="">Select Role</option>
  <option value="Admin">Admin</option>
  <option value="Management">Management</option>
  <option value="Finance">Finance</option>
  <option value="Sales">Sales</option>
  <option value="Supply Chain">Supply Chain</option>
  <option value="HR">HR</option>
</select>

<input
  type="text"
  name="department"
  placeholder="Department"
  value={form.department}
  onChange={handleChange}
  className="w-full rounded-xl bg-slate-900 p-3"
  required
/>
<input
  type="number"
  name="salary"
  placeholder="Salary"
  value={form.salary}
  onChange={handleChange}
  className="w-full rounded-xl bg-slate-900 p-3"
  required
/>
  <input
  type="text"
  name="phone"
  placeholder="Phone"
  value={form.phone}
  onChange={handleChange}
  className="w-full rounded-xl bg-slate-900 p-3"
  required
/>
  <input
  type="date"
  name="joiningDate"
  value={form.joiningDate}
  onChange={handleChange}
  className="w-full rounded-xl bg-slate-900 p-3"
  required
/>
        <button className="bg-emerald-400 px-5 py-2 rounded-full text-black">
          Add Employee
        </button>
      </form>
      )}
  <Link to="/employees" className="text-emerald-300">
  View All Employees →
</Link>
    </section>
  );
}

export default HR;