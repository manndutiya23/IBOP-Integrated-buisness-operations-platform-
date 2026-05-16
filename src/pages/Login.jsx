import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:5000/api/employees/login",
        form
      );

      login(
        res.data.employee,
        res.data.token
      );

      navigate("/");

    } catch (error) {

      console.error(error);

      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8"
      >

        <h2 className="mb-6 text-3xl font-bold text-white">
          IBOP Login
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="mb-4 w-full rounded-xl bg-slate-900 p-3 text-white"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="mb-6 w-full rounded-xl bg-slate-900 p-3 text-white"
          required
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-emerald-400 py-3 font-semibold text-black transition hover:bg-emerald-300"
        >
          Login
        </button>

      </form>
    </div>
  );
}

export default Login;