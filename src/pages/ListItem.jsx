import axios from "axios";
import { useEffect, useState } from "react";
import { backendUrl } from "../components/Config";
import { toast, Toaster } from "react-hot-toast";
import "./ListItem.css";
import PropTypes from "prop-types";

// Function to render stars for rating
const renderStars = (rating) => {
  let stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<span key={i} className="star filled">★</span>);
    } else {
      stars.push(<span key={i} className="star">☆</span>);
    }
  }
  return stars;
};

const ListItem = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProductData, setEditProductData] = useState(null);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`, {
        headers: { token },
      });

      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error.message)
      toast.error("An error occurred while fetching products.");
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error.message)
      toast.error("An error occurred while removing the product.");
    }
  };

  const openEditForm = (product) => {
    setEditProductData(product);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", editProductData._id);
    formData.append("name", editProductData.name);
    formData.append("description", editProductData.description);
    formData.append("oldprice", editProductData.oldprice);
    formData.append("newprice", editProductData.newprice);
    formData.append("category", editProductData.category);
    formData.append("discount", editProductData.discount);
    formData.append("rating", editProductData.rating);

    if (editProductData.image && editProductData.image.length > 0) {
      editProductData.image.forEach((img, index) => {
        formData.append(`image${index + 1}`, img);
      });
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/product/update`,
        formData,
        {
          headers: {
            token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setEditProductData(null); // Close the form after successful update
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error.message)
      toast.error("An error occurred while updating the product.");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProductData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (token) {
      fetchList();
    } else {
      toast.error("You must be logged in to view products.");
    }
  }, [token]);

  return (
    <div className="admin-panel">
      <h1>Product List</h1>

      {loading ? (
        <div className="no-data">Loading products...</div>
      ) : list.length === 0 ? (
        <div className="no-data">No products available.</div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="table-container">
            <table className="product-table">
              <thead>
                <tr>
                  <th>Images</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Old Price</th>
                  <th>New Price</th>
                  <th>(%)Discount</th>
                  <th>Category</th>
                  <th>Rating</th> {/* Added Rating Column */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div className="image-gallery">
                        {product.image.map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`Product ${product.name}`}
                            className="product-thumbnail"
                          />
                        ))}
                      </div>
                    </td>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>₹{product.oldprice}</td>
                    <td>₹{product.newprice}</td>
                    <td>{product.discount}%</td>
                    <td>{product.category}</td>
                    <td>{renderStars(product.rating)}</td> {/* Displaying Star Rating */}
                    <td>
                      <div className="btns">
                        <button
                          className="action-button delete"
                          onClick={() => removeProduct(product._id)}
                        >
                          Delete
                        </button>
                        <button
                          className="action-button edit"
                          onClick={() => openEditForm(product)}
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="mobile-product-list">
            {list.map((product) => (
              <div className="product-card" key={product._id}>
                <div className="product-images">
                  {product.image.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Product ${product.name}`}
                      className="product-card-image"
                    />
                  ))}
                </div>
                <div className="product-details">
                  <p><strong>Name:</strong> {product.name}</p>
                  <p><strong>Description:</strong> {product.description}</p>
                  <p><strong>Old Price:</strong> ₹{product.oldprice}</p>
                  <p><strong>New Price:</strong> ₹{product.newprice}</p>
                  <p><strong>Discount:</strong> {product.discount}%</p>
                  <p><strong>Category:</strong> {product.category}</p>
                  <p><strong>Rating:</strong> {renderStars(product.rating)}</p> {/* Displaying Star Rating */}
                  <div className="product-card-actions">
                    <button
                      className="action-button delete"
                      onClick={() => removeProduct(product._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="action-button edit"
                      onClick={() => openEditForm(product)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Product Form */}
          {editProductData && (
            <div className="edit-form-container">
              <h2>Edit Product</h2>
              <form onSubmit={handleEditSubmit}>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={editProductData.name}
                  onChange={handleEditChange}
                />
                <label>Description</label>
                <textarea
                  name="description"
                  value={editProductData.description}
                  onChange={handleEditChange}
                />
                <label>Old Price</label>
                <input
                  type="number"
                  name="oldprice"
                  value={editProductData.oldprice}
                  onChange={handleEditChange}
                />
                <label>New Price</label>
                <input
                  type="number"
                  name="newprice"
                  value={editProductData.newprice}
                  onChange={handleEditChange}
                />
                <label>Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={editProductData.discount}
                  onChange={handleEditChange}
                />
                <label>Category</label>
                <select
                  name="category"
                  value={editProductData.category}
                  onChange={handleEditChange}
                  required
                >
                  <option value="phones">Phones</option>
                  <option value="smartwatch">Smartwatch</option>
                  <option value="computers">Computers</option>
                  <option value="camera">Camera</option>
                  <option value="headphones">Headphones</option>
                  <option value="gaming">Gaming</option>
                  <option value="homeneeds">Home Needs</option>
                </select>
                <label>Rating</label>
                <input
                  type="number"
                  name="rating"
                  value={editProductData.rating}
                  onChange={handleEditChange}
                />
                <div className="form-actions">
                  <button type="submit">Save Changes</button>
                  <button
                    type="button"
                    onClick={() => setEditProductData(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

ListItem.propTypes = {
  token: PropTypes.string.isRequired,
};

export default ListItem;
