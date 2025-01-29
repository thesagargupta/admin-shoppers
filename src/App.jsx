import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import ListItem from "./pages/ListItem";
import Order from "./pages/Order";
import AddItem from "./pages/AddItem";
import Home from "./pages/Home";
import Error from "./pages/Error";
import { useState, useEffect } from "react"; // Import useEffect
import { ToastContainer } from "react-toastify";

function App() {
  const [token, setToken] = useState("");

  // Retrieve token from localStorage on initial load
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []); // Run only on initial render

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token"); // Clear token from localStorage
  };

  const handleLogin = (newToken) => {
    setToken(newToken); 
    localStorage.setItem("token", newToken); // Save token to localStorage
  };

  return (
    <Router>
      <ToastContainer />
      {token === "" ? (
        <Login setToken={handleLogin} /> 
      ) : (       
         <div className="app-layout">
          <Navbar handleLogout={handleLogout} />
          <div className="main-content">
            <Routes>
              <Route path="/add" element={<AddItem token={token} />} />
              <Route path="/orders" element={<Order token={token} />} />
              <Route path="/list" element={<ListItem token={token} />} />
              <Route path="/" element={<Home />} />
              <Route path="*" element={<Error />} />
            </Routes>
          </div>
        </div>
       )}
    </Router>
  );
}

export default App;
