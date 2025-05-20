// Login.jsx
import './Login.css';
import React, { useState } from 'react';
 

const Login = () => {
  return (
    <div className="login-body" id="login">
  <div className="login-container">
    <div className="social-login">
      <button className="btn facebook">f Log In</button>
      <button className="btn google">g+ Log In</button>
    </div>
    <div className="form-login">
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <a href="#">Don't have an account? Click here to sign up.</a><br />
      <label>
        <input type="checkbox" /> Remember me
      </label>
      <a href="#" className="reset-link">Reset Password</a>
      <button className="btn login-btn">Log In</button>
    </div>
  </div>
</div>

  );
};

export default Login;
