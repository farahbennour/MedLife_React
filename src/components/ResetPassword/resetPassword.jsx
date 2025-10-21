import React from "react";
import "./ResetPassword.css";


const ResetPassword = () => {
  return (
    <div className="reset-page" >
    
      <div className="reset-card">
        <h2>Reset Password</h2>
        <form>
          

          <label htmlFor="new-password">New Password</label>
          <input type="password" id="new-password" placeholder="New password" />


          <button type="submit">Reset</button>
        </form>
        <div className="login-link">
          <a href="/login">Back to login</a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
