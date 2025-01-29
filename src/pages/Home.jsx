import { useEffect } from "react";
import { Pie, Line } from "react-chartjs-2";
import "chart.js/auto"; // Automatically imports required chart types
import { FaRupeeSign , FaUsers, FaClipboardList } from "react-icons/fa";
import "./Home.css";

const Home = () => {
  // Pie chart data
  const pieData = {
    labels: ["Electronics", "Clothing", "Home Appliances", "Books", "Other"],
    datasets: [
      {
        data: [40, 30, 15, 10, 5],
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  // Line chart data (Monthly Sales)
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Monthly Sales ($)",
        data: [2000, 3000, 4000, 5000, 4500, 6000, 7000, 6500, 7500, 8000, 8500, 9000],
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        tension: 0.4,
      },
    ],
  };

  useEffect(() => {
    document.title = "Shoopers Admin Dashboard";
  }, []);

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome Sagar, To Your Admin Dashboard</h1>
        <p>Track your business performance with live analytics and insights.</p>
      </header>

      {/* Statistics Section */}
      <div className="statistics-summary">
        <div className="stat-card">
          <FaRupeeSign  className="stat-icon" />
          <h2>₹120,000</h2>
          <p>Total Sales</p>
        </div>
        <div className="stat-card">
          <FaUsers className="stat-icon" />
          <h2>5,000</h2>
          <p>Active Users</p>
        </div>
        <div className="stat-card">
          <FaClipboardList className="stat-icon" />
          <h2>15,000</h2>
          <p>Total Orders</p>
        </div>
      </div>

      {/* Dashboard Chart Section */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Sales Distribution</h2>
          <Pie data={pieData} />
        </div>
        <div className="dashboard-card">
          <h2>Monthly Sales</h2>
          <Line data={lineData} />
        </div>
      </div>

      <footer className="home-footer">
        <p>© 2025 Shoopers Admin Panel. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
