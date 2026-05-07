import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const BASE = "http://localhost:5000/api";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ validation
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      // ✅ handle backend errors
      if (!res.ok) {
        if (res.status === 409) {
          throw new Error("User already exists. Please login.");
        }
        throw new Error(data.error || "Registration failed");
      }

      // ✅ success → go to login
      alert("Registration successful! Please login.");
      navigate("/");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-brand">⚡ TaskFlow</div>

        <h2 className="auth-title">Create your account</h2>
        <p className="auth-sub">Join your team on TaskFlow</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">

          {/* Name */}
          <div className="auth-field">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Role */}
          <div className="auth-field">
            <label>Select Role</label>
            <div className="auth-role-group">
              <button
                type="button"
                className={`auth-role-pill ${role === "user" ? "active-user" : ""}`}
                onClick={() => setRole("user")}
              >
                👤 Employee
              </button>

              <button
                type="button"
                className={`auth-role-pill ${role === "admin" ? "active-admin" : ""}`}
                onClick={() => setRole("admin")}
              >
                🛡️ Admin
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="auth-divider" />

        {/* Login Redirect */}
        <p className="auth-footer">
          Already have an account?{" "}
          <button
            className="auth-link"
            onClick={() => navigate("/")}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}