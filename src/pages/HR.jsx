import { useState } from "react";
import { useBusinessData } from "../context/BusinessDataContext";
import { Link } from "react-router-dom";

function HR() {
  const { addEmployee, role } = useBusinessData();

  const [form, setForm] = useState({
    name: "",
    designation: "",
    contact: "",
    email: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.designation || !form.contact || !form.email) return;

    addEmployee(form);

    setForm({ name: "", designation: "", contact: "", email: "" });
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

        <select
  name="designation"
  value={form.designation}
  onChange={handleChange}
  className="w-full p-3 bg-slate-900 rounded-xl"
  required
>
  <option value="">Select Role</option>
  <option>Management</option>
  <option>Sales</option>
  <option>Finance</option>
  <option>HR</option>
</select>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-3 bg-slate-900 rounded-xl"
          required
        />

        <input
          name="contact"
          value={form.contact}
          onChange={handleChange}
          placeholder="Contact"
          className="w-full p-3 bg-slate-900 rounded-xl"
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