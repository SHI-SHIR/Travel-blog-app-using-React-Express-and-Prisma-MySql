import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import blogContext from "../context/blogContext";
import Navbar from "./Navbar";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const context = useContext(blogContext);
  // Destructure blogs (to find the initial blog data), editBlog, and context loading/error states
  const { blogs, editBlog, loading: contextLoading, error: contextError, fetchBlogById } = context;

  const [blog, setBlog] = useState({
    title: "",
    description: "",
    image: "", // This will now store the URL string directly
  });

  const [localLoading, setLocalLoading] = useState(true); // For initial blog fetch
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    const loadBlogForEdit = async () => {
      setLocalLoading(true);
      setLocalError(null);
      try {
        const blogData = await fetchBlogById(id); // Use the fetchBlogById from context
        if (blogData) {
          setBlog({
            title: blogData.title,
            description: blogData.description,
            image: blogData.image || "", // Ensure it's a string, even if null/undefined
          });
        } else {
          setLocalError("Blog not found for editing.");
        }
      } catch (err) {
        console.error("Error fetching blog for edit:", err);
        setLocalError(err.message || "Failed to load blog for editing.");
      } finally {
        setLocalLoading(false);
      }
    };

    loadBlogForEdit();
  }, [id, fetchBlogById]); // Depend on id and fetchBlogById (which is stable)


  const onChange = (e) => {
    // This is simplified as we're no longer handling file uploads or base64 conversion
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

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
      await editBlog(Number(id), blog.title, blog.description, blog.image);
      alert("Blog updated successfully!"); // User feedback
      navigate("/blog"); // Navigate back to blogs list
    } catch (err) {
      console.error("Failed to update blog:", err);
      // alert(`Failed to update blog: ${contextError || err.message}`); // If you want an alert
    }
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

  if (localLoading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen text-black text-xl pt-24">
          Loading blog for edit...
        </div>
      </>
    );
  }

  if (localError) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen text-red-600 text-xl pt-24">
          Error: {localError}
        </div>
      </>
    );
  }

  // If blog is null after loading and no error, means it wasn't found.
  if (!blog) {
      return (
        <>
          <Navbar />
          <div className="flex justify-center items-center min-h-screen text-black text-xl pt-24">
            Blog data not found.
          </div>
        </>
      );
  }


  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center items-center font-space min-h-screen pt-24 pb-10 text-black">
        <h1 className="text-3xl mt-10 mb-6 font-bold">Edit Blog</h1>

        <form
          onSubmit={handleClick}
          className="flex flex-col space-y-6 w-full max-w-4xl bg-white p-8 rounded-lg shadow-md"
        >
          {/* Title Input */}
          <input
            className="w-full px-5 py-3 border-2 border-zinc-300 focus:border-yellow-500 bg-transparent outline-none rounded-lg text-lg transition duration-200"
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
            placeholder="Update blog description..."
            rows={10}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 500)}px`;
            }}
            className="w-full px-5 py-4 text-lg border-2 border-zinc-300 focus:border-yellow-500 bg-transparent outline-none rounded-lg overflow-y-auto resize-none transition duration-200"
            value={blog.description}
            onChange={onChange}
            style={{ maxHeight: "500px" }}
            required
          />

          {/* Image URL Input (Changed from file input) */}
          <input
            className="w-full px-5 py-3 border-2 border-zinc-300 focus:border-yellow-500 bg-transparent outline-none rounded-lg text-lg transition duration-200"
            type="url" // HTML5 type for URL validation hints
            name="image"
            id="image"
            value={blog.image}
            onChange={onChange}
            placeholder="Image URL (e.g., https://example.com/your-image.jpg)"
          />

          {/* Image preview */}
          {blog.image && (
            <div className="mt-2 text-center">
              <p className="text-gray-600 text-sm mb-2">Image Preview:</p>
              <img
                src={blog.image}
                alt="Blog Preview"
                className="max-h-64 object-contain rounded-md border border-gray-300 mx-auto"
                onError={handleImageError}
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={contextLoading} // Use contextLoading
            className={`w-full px-5 py-3 bg-yellow-600 hover:bg-yellow-700 text-white text-lg font-semibold rounded-lg transition duration-200 ${
              contextLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {contextLoading ? "Updating..." : "Update Blog"}
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

export default EditBlog;