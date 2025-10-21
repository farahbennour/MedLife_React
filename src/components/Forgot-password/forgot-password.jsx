import React from "react";
import "./ForgotPassword.css";


const ForgotPassword = () => {
  return (
    <div className="forgot-page">
     

      <div className="forgot-card">
        <h2>Forgot Password</h2>
        <p className="instruction">
          Enter your email address below and we’ll send you a link to reset your password.
        </p>
        <form>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Enter your email" />
          <button type="submit">Send Link</button>
        </form>
        <div className="login-link">
          <a href="/login">Back to login</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
