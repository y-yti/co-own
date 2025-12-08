import { useState } from "react";
import "./LoginPage.css";

function LoginPage({ onLogin }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onLogin(name.trim());
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="logo">Co-own</h1>
        <p className="subtitle">Sign in as Investor</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="form-label">
            Login name
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
          </label>

          <button type="submit" className="btn-primary">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
