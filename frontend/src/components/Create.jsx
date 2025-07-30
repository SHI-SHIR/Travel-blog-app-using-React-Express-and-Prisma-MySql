import React, { useState, useContext } from "react";
import Navbar from "./Navbar";
import blogContext from "../context/blogContext";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const context = useContext(blogContext);
  // Destructure addBlog, and also loading/error from context for global feedback
  const { addBlog, loading: contextLoading, error: contextError } = context;

  const navigate = useNavigate();

  const [blog, setBlog] = useState({
    title: "",
    description: "",
    image: "", // This will now store the URL string directly
  });

  // No longer need a local loading state if addBlog handles it via contextLoading
  // const [loading, setLoading] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();

    if (!blog.title.trim() || !blog.description.trim()) {
      alert("Please enter a title and description.");
      return;
    }

    // Basic validation for image URL if it's provided
    if (blog.image && !isValidUrl(blog.image)) {
        alert("Please enter a valid image URL (must start with http:// or https://).");
        return;
    }

    try {
      // addBlog is already using the context's loading state internally
      await addBlog(blog.title, blog.description, blog.image);
      setBlog({ title: "", description: "", image: "" }); // Clear form
      alert("Blog created successfully!"); // User feedback
      navigate("/blog"); // Navigate to blogs list
    } catch (err) {
      // The addBlog function already sets contextError
      // You can just log locally or rely on contextError being displayed
      console.error("Failed to create blog:", err);
      // alert(`Failed to create blog: ${contextError || err.message}`); // If you want an alert
    }
  };

  const onChange = (e) => {
    // This is simplified as we're no longer handling file uploads or base64 conversion
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  // Helper function for basic URL validation
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return string.startsWith('http://') || string.startsWith('https://');
    } catch (e) {
      return false;
    }
  };

  // Handle image error for preview
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = "https://via.placeholder.com/200x150?text=Invalid+Image+URL"; // Fallback placeholder
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center items-center min-h-screen font-space pt-24 pb-10 text-black"> {/* Added pt-24 and pb-10 for spacing */}
        <h1 className="text-3xl mt-10 mb-6 font-bold">Create New Blog</h1> {/* Adjusted margin */}

        <form
          onSubmit={handleClick}
          className="flex flex-col space-y-6 w-full max-w-4xl bg-white p-8 rounded-lg shadow-md" // Increased padding
        >
          {/* Title Input */}
          <input
            className="w-full px-5 py-3 border-2 border-zinc-300 focus:border-blue-500 bg-transparent outline-none rounded-lg text-lg transition duration-200" // Improved styling
            type="text"
            name="title"
            id="title"
            value={blog.title}
            onChange={onChange}
            placeholder="Blog Title"
            required
          />

          {/* Description Textarea */}
          <textarea
            name="description"
            id="description"
            placeholder="Write your blog description here..."
            rows={10}
            // Auto-resize logic (good to keep)
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 500)}px`;
            }}
            className="w-full px-5 py-4 text-lg border-2 border-zinc-300 focus:border-blue-500 bg-transparent outline-none rounded-lg overflow-y-auto resize-none transition duration-200" // Improved styling
            value={blog.description}
            onChange={onChange}
            style={{ maxHeight: "500px" }}
            required
          />

          {/* Image URL Input (Changed from file input) */}
          <input
            className="w-full px-5 py-3 border-2 border-zinc-300 focus:border-blue-500 bg-transparent outline-none rounded-lg text-lg transition duration-200" // Improved styling
            type="url" // HTML5 type for URL validation hints
            name="image"
            id="image"
            value={blog.image}
            onChange={onChange}
            placeholder="Image URL (e.g., https://example.com/your-image.jpg)"
          />

          {/* Image preview (only if a URL is entered) */}
          {blog.image && (
            <div className="mt-2 text-center">
              <p className="text-gray-600 text-sm mb-2">Image Preview:</p>
              <img
                src={blog.image}
                alt="Preview"
                className="max-h-64 object-contain rounded-md border border-gray-300 mx-auto" // Centered and max-height
                onError={handleImageError} // Handle broken image links
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={contextLoading} // Use contextLoading
            className={`w-full px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg transition duration-200 ${
              contextLoading ? "opacity-70 cursor-not-allowed" : "" // Styling for disabled state
            }`}
          >
            {contextLoading ? "Creating..." : "Create Blog"}
          </button>
          
          {/* Display global error message if any */}
          {contextError && (
            <p className="text-red-500 text-center mt-4 text-sm">{contextError}</p>
          )}
        </form>
      </div>
    </>
  );
};

export default Create;