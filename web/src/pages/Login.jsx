import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (username.trim().length > 0 && password.length > 0) {
      login(username.trim());
      navigate("/");
    }
  };

  return (
    <main className="dashboard login-page">
      <section className="login-card">
        <h1>BAS Control Validation</h1>
        <p>Local Breach and Attack Simulation control validation dashboard</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button type="submit">Sign In</button>
        </form>
      </section>
    </main>
  );
}
