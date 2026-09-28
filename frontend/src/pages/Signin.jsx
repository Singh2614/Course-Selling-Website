import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Signin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await api.post("/users/signin", form);
      login(response.data.token, response.data.user);
      navigate("/courses");
    } catch (error) {
      setError(error.response?.data?.message || "Signin failed.");
    }
  }

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <span className="eyebrow">WELCOME BACK</span>
        <h1>Sign in</h1>
        <p>Continue learning where you left off.</p>

        <label>Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com"
        />

        <label>Password</label>
        <input
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="••••••••"
        />

        {error && <div className="error">{error}</div>}

        <button className="primary-button full">Sign in</button>
        <p className="switch-text">
          Don't have an account? <Link to="/signup">Create one</Link>
        </p>
      </form>
    </section>
  );
}
