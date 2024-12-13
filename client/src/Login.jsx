import { useState } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

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
    <div className="login-form">
      {loading && <div>Loading...</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading}>
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