import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function Login() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });

    if (name === "email") {
      if (!value) {
        setErrors((prev) => ({ ...prev, email: "Email is required" }));
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    }

    if (name === "password") {
      if (!value) {
        setErrors((prev) => ({ ...prev, password: "Password is required" }));
      } else if (value.length < 6) {
        setErrors((prev) => ({
          ...prev,
          password: "Password must be at least 6 characters",
        }));
      } else {
        setErrors((prev) => ({ ...prev, password: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (errors.email || errors.password || !credentials.email || !credentials.password) {
      toast.error("Please fix validation errors");
      return;
    }

    try {
      const res = await axios.post(
        "https://stock-trading-app-ton3.onrender.com/login",
        credentials,
        { withCredentials: true }
      );

      if (res.status === 200 && res.data.message === "Login successful") {
        toast.success("Login successful!");
        window.location.href = res.data.redirectUrl;
      }
    } catch (err) {
      console.error(err);
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="text-center mb-4">Login to Your Trading Account</h2>
      <form
        onSubmit={handleSubmit}
        className="p-4 border rounded shadow-sm bg-light needs-validation"
        noValidate
      >
        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : credentials.email ? "is-valid" : ""}`}
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
        </div>

        <div className="row mb-4">
          <div className="col">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : credentials.password ? "is-valid" : ""}`}
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-success w-100"
          style={{ backgroundColor: "#1c75bc", color: "#fff" }}
        >
          Login
        </button>

        <p className="text-center mt-3 text-muted">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
