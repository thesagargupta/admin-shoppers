import "./Login.css";
import logo from "../assets/logo.png";
import { useState, useEffect } from "react";
import { backendUrl } from "../components/Config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import toast, { Toaster } from "react-hot-toast";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Load token from localStorage on initial load
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken); // If token exists, set it in state
      navigate("/"); // Redirect to home page
    }
  }, [setToken, navigate]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Logging in...");
    
    try {
      const response = await axios.post(backendUrl + "/api/user/admin", {
        email,
        password,
      });

      toast.dismiss(loadingToast); // Remove loading toast
      
      if (response.data.success) {
        localStorage.setItem("token", response.data.token); // Store token in localStorage
        setToken(response.data.token); // Set token in state
        toast.success("Login successful!");
        navigate("/"); // Navigate to home page
      } else {
        toast.error(response.data.message); // Invalid credentials message
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.log(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="login-container">
        <div className="login-box">
          <div className="logo-container">
            <img src={logo} alt="Logo" className="login-logo" />
          </div>
          <h2>Admin Login</h2>
          <form onSubmit={onSubmitHandler}>
            <div className="input-group">
              <label htmlFor="username">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="text"
                id="username"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                id="password"
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="btn-login">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default Login;
