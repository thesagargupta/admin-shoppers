import axios from "axios";
import { useEffect, useState } from "react";
import { backendUrl } from "../components/Config";
import { toast, Toaster } from "react-hot-toast";
import "./Listitem.css";
import PropTypes from "prop-types";

const Order = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/order/list`, {}, {
        headers: { token },
      });

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error.message);
      toast.error("An error occurred while fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (id, newStatus) => {
    try {
      console.log("Updating Order ID:", id, "New Status:", newStatus); // Debugging Log

      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { id, status: newStatus },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Order status updated successfully!");
        await fetchOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating order status:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "An error occurred while updating the order.");
    }
  };

  // Cancel order
  const cancelOrder = async (id) => {
    try {
      console.log("Cancelling order with ID:", id);  // Log the ID to check

      // First, update the status locally (optimistic UI update)
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, status: "Cancelled" } : order
        )
      );

      // Then, make the API call to cancel the order
      const response = await axios.post(
        `${backendUrl}/api/order/cancel`,  // Check this endpoint
        { id },  // Ensure this is the correct payload structure for your backend
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Order cancelled successfully!");
        await fetchOrders();  // Refresh the order list after cancellation
      } else {
        // If the API fails, revert the status to 'Pending'
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === id ? { ...order, status: "Pending" } : order
          )
        );
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error cancelling order:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "An error occurred while cancelling the order.");

      // Revert the status change if there was an error
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, status: "Pending" } : order
        )
      );
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    } else {
      toast.error("You must be logged in to view orders.");
    }
  }, [token]);

  return (
    <div className="admin-panel">
      <h1>Order List</h1>

      {loading ? (
        <div className="no-data">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="no-data">No orders available.</div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="table-container">
            <table className="product-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Items</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.address?.fullName || "N/A"}</td>
                    <td>₹{order.amount.toFixed(2)}</td>
                    <td>
                      {order.status === "Cancelled" ? (
                        <span>{order.status}</span>
                      ) : (
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order._id, e.target.value)
                          }
                        >
                          <option value="Pending">Placed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      )}
                    </td>
                    <td>
                      <ul>
                        {order.items.map((item) => (
                          <li key={item._id}>
                            {item.name} - {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      {order.status !== "Cancelled" && (
                        <button
                          className="action-button cancel"
                          onClick={() => cancelOrder(order._id)}
                          style={{ backgroundColor: "red", color: "white" }}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="mobile-product-list">
            {orders.map((order) => (
              <div className="product-card" key={order._id}>
                <div className="product-details">
                  <p><strong>Order ID:</strong> {order._id}</p>
                  <p><strong>Customer:</strong> {order.address?.fullName || "N/A"}</p>
                  <p><strong>Total:</strong> ₹{order.amount.toFixed(2)}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {order.status === "Cancelled" ? (
                      <span>{order.status}</span>
                    ) : (
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order._id, e.target.value)
                        }
                      >
                        <option value="Pending">Placed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    )}
                  </p>
                  <p><strong>Items:</strong></p>
                  <ul>
                    {order.items.map((item) => (
                      <li key={item._id}>
                        {item.name} - {item.quantity}
                      </li>
                    ))}
                  </ul>
                  <div className="product-card-actions">
                    {order.status !== "Cancelled" && (
                      <button
                        className="action-button cancel"
                        onClick={() => cancelOrder(order._id)}
                        style={{ backgroundColor: "red", color: "white" }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

Order.propTypes = {
  token: PropTypes.string.isRequired,
};

export default Order;
