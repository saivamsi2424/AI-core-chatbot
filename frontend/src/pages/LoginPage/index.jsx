import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

function LoginPage() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

    if (isSignup && !username) {
      newErrors.username = "Username is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length !== 0) return;

    try {
      const url = isSignup
        ? "https://ai-core-backend.onrender.com/api/auth/signup"
        : "https://ai-core-backend.onrender.com/api/auth/login";

      const body = isSignup
        ? { username, email, password }
        : { email, password };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      // SIGNUP
      if (isSignup) {
        alert("Account created successfully! Please login.");
        setIsSignup(false);
        return;
      }

      // LOGIN
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username);

      alert("Login successful ");

      navigate("/home");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>{isSignup ? "Create Account" : "Login"}</h2>

        {/* Username only for signup */}
        {isSignup && (
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={errors.username ? "error-input" : ""}
            />
            {errors.username && <p className="error-text">{errors.username}</p>}
          </div>
        )}

        <div className="input-group">
          <input
            type="text"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? "error-input" : ""}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? "error-input" : ""}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <button type="submit">{isSignup ? "Create Account" : "Login"}</button>

        {/* Toggle */}
        <p
          style={{
            marginTop: "10px",
            cursor: "pointer",
            color: "#6c63ff",
          }}
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup
            ? "Already have an account? Login"
            : "Don't have an account? Create one"}
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
