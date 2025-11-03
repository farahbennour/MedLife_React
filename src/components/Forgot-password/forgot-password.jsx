
import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // ← import SweetAlert2
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/users/request-password-reset", { email });

      // SweetAlert success
      Swal.fire({
        icon: "success",
        title: "Email sent!",
        text: "Check your inbox to reset your password.",
        confirmButtonColor: "#1fa6a3",
      });

      setEmail(""); // reset email field
    } catch (err) {
      console.error(err);

      // SweetAlert error
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error sending reset request. Please try again.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <h2>Forgot Password</h2>
        <p className="instruction">
          Enter your email address below and we’ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Link</button>
        </form>

        {message && <p className="success-msg">{message}</p>}
        {error && <p className="error-msg">{error}</p>}

        <div className="login-link">
          <a href="/login">Back to login</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
