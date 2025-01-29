import { useState } from "react";
import { FaStar } from "react-icons/fa"; // Importing star icon from react-icons
import uploadImage from "../assets/upload-item.png";
import "./AddItem.css";
import axios from "axios";
import { backendUrl } from "../components/Config";
import PropTypes from "prop-types";
import { toast, Toaster } from "react-hot-toast";

const AddItem = ({ token }) => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [category, setCategory] = useState("homeneeds");
  const [discount, setDiscount] = useState("");
  const [rating, setRating] = useState(1); // Add state for rating
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to handle image upload
  const handleImageChange = (e, setImage) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Validate input fields
    if (!name || !description || !oldPrice || !newPrice || !category || !discount || !rating) {
      toast.error("All fields are required.");
      return;
    }

    if (!image1 || !image2 || !image3) {
      toast.error("All images are required.");
      return;
    }

    if (isNaN(Number(oldPrice)) || isNaN(Number(newPrice)) || isNaN(Number(discount)) || isNaN(Number(rating))) {
      toast.error("Old Price, New Price, Discount, and Rating must be valid numbers.");
      return;
    }

    if (Number(oldPrice) <= Number(newPrice)) {
      toast.error("Old Price must be greater than New Price.");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Saving product...");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("oldprice", oldPrice);
      formData.append("newprice", newPrice);
      formData.append("category", category);
      formData.append("discount", discount);
      formData.append("rating", rating); // Append rating
      formData.append("image1", image1);
      formData.append("image2", image2);
      formData.append("image3", image3);

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: { token },
      });

      if (response.data.success) {
        toast.dismiss(); // Dismiss the loading toast
        toast.success("Product added successfully!");
        // Reset the form
        setName("");
        setDescription("");
        setOldPrice("");
        setNewPrice("");
        setCategory("homeneeds");
        setDiscount("");
        setRating(1); // Reset rating after success
        setImage1(null);
        setImage2(null);
        setImage3(null);
      } else {
        throw new Error(response.data.message || "Failed to add product.");
      }
    } catch (error) {
      toast.dismiss(); // Dismiss the loading toast
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="centre-div">
      <form className="add-item-form" onSubmit={onSubmitHandler}>
        <div>
          <p>Upload Images</p>
        </div>
        <div className="image">
          {[image1, image2, image3].map((image, index) => (
            <label key={index} htmlFor={`image${index + 1}`} className="image-upload-label">
              <img
                src={image ? URL.createObjectURL(image) : uploadImage}
                alt="Upload"
                className="upload-image"
              />
              <input
                type="file"
                id={`image${index + 1}`}
                hidden
                onChange={(e) => handleImageChange(e, [setImage1, setImage2, setImage3][index])}
                required
              />
            </label>
          ))}
        </div>
        <div>
          <p>Product Name</p>
          <input
            type="text"
            placeholder="Type your product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <p>Product Description</p>
          <textarea
            placeholder="Give your description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <p>Product Category</p>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="phones">Phones</option>
            <option value="smartwatch">Smartwatch</option>
            <option value="computers">Computers</option>
            <option value="camera">Camera</option>
            <option value="headphones">Headphones</option>
            <option value="gaming">Gaming</option>
            <option value="homeneeds">Home Needs</option>
          </select>
        </div>
        <div>
          <p>Old Price</p>
          <input
            type="number"
            placeholder="Enter Your Old Price"
            value={oldPrice}
            onChange={(e) => setOldPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <p>New Price</p>
          <input
            type="number"
            placeholder="Enter Your New Price"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <p>Discount</p>
          <input
            type="number"
            placeholder="Enter Your Discount Percentage"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            required
          />
        </div>
        <div>
          <p>Rating</p>
          <select value={rating} onChange={(e) => setRating(e.target.value)} required>
            <option value={1}>1 Star</option>
            <option value={2}>2 Stars</option>
            <option value={3}>3 Stars</option>
            <option value={4}>4 Stars</option>
            <option value={5}>5 Stars</option>
          </select>
        </div>

        {/* Render stars based on rating */}
        <div className="star-rating">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              color={index < rating ? "#FFD700" : "#D3D3D3"} // Gold color for filled, light gray for empty
              size={24}
            />
          ))}
        </div>

        <div>
          <button type="submit" className="add-item" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Add Item"}
          </button>
        </div>
      </form>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

AddItem.propTypes = {
  token: PropTypes.string.isRequired,
};

export default AddItem;
