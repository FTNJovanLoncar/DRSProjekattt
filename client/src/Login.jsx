import { useState } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the new CSS file

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Submit button clicked");

    if (!username || !password) {
        setError("Please enter both username and password.");
        return;
    }

    setLoading(true);
    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: username, password }),
      credentials: 'include',
    })
    .then((response) => {
        setLoading(false);
        console.log(response);
        if (response.ok) {
            response.json().then((user) => {
                onLogin(user); // Set the logged-in user
                navigate("/"); // Redirect to the home page
            });
        } else {
            response.json().then((error) => {
                setError("Login failed: " + (error.message || "Unknown error"));
            });
        }
    })
    .catch((err) => {
        setLoading(false);
        setError(`An error occurred: ${err.message}`); // More descriptive error
        console.error("Login error details:", err);
    });
  };

  return (
    <div className="login-form-container">
      {loading && <div className="loading-message">Loading...</div>}
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Login</h2>
        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Logging in..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;
