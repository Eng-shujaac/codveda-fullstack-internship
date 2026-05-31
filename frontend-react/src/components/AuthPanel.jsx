import React, { useState } from "react";
import LoginForm from "./LoginForm.jsx";
import RegisterForm from "./RegisterForm.jsx";

function AuthPanel({ onLogin, onRegister }) {
  const [activeForm, setActiveForm] = useState("login");

  return (
    <section className="panel auth-panel" aria-labelledby="auth-title">
      <div className="section-header">
        <div>
          <h2 id="auth-title">Account Access</h2>
          <p>Please login to create, update, or delete tasks.</p>
        </div>
      </div>

      <div className="auth-tabs" aria-label="Authentication options">
        <button
          className={activeForm === "login" ? "active-tab" : "secondary-button"}
          type="button"
          onClick={() => setActiveForm("login")}
        >
          Login
        </button>
        <button
          className={
            activeForm === "register" ? "active-tab" : "secondary-button"
          }
          type="button"
          onClick={() => setActiveForm("register")}
        >
          Register
        </button>
      </div>

      {activeForm === "login" ? (
        <LoginForm onLogin={onLogin} />
      ) : (
        <RegisterForm onRegister={onRegister} />
      )}
    </section>
  );
}

export default AuthPanel;
