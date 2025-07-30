import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import blogContext from "../context/blogContext"; // Ensure path is correct

// Assuming updateBlog is no longer used directly by BlogItem
const BlogItem = ({ blog }) => { // Removed updateBlog from destructuring
  const { deleteBlog } = useContext(blogContext);
  const navigate = useNavigate();

  // Helper to truncate description for display
  const truncateDesc = (desc, length = 150) =>
    (desc && desc.length > length) ? desc.slice(0, length) + "..." : desc || "No description available";

  // Fallback image URL for broken links
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop if fallback also fails
    e.target.src = "https://via.placeholder.com/400x225?text=Image+Not+Available"; // Placeholder image
  };

  return (
    <div className="bg-white font-poppins rounded-lg shadow-lg overflow-hidden flex flex-col cursor-pointer hover:shadow-xl transition-shadow duration-300">
      {/* Image container - clicking navigates to blog details */}
      <div
        className="aspect-video overflow-hidden relative" // Changed aspect ratio for common blog images (16:9)
        onClick={() => navigate(`/blog/${blog.id}`)}
      >
        <img
          src={blog.image} // Assumes blog.image is a URL
          alt={blog.title || "Blog Image"} // Add a fallback for alt text
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110 hover:brightness-75"
          onError={handleImageError} // Added error handler for images
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-black font-bold text-xl mb-2">{blog.title}</h3>

        <p className="text-black flex-grow">
          {truncateDesc(blog.description)}
          {/* Only show 'Read more' if description was actually truncated */}
          {blog.description && blog.description.length > 150 && (
            <Link
              to={`/blog/${blog.id}`}
              className="text-blue-600 hover:underline ml-1"
            >
              Read more
            </Link>
          )}
        </p>
        
        {/* Blog date/author (optional, but good for blogs) */}
        {blog.date && (
            <p className="text-gray-500 text-sm mt-2">
                Published on: {new Date(blog.date).toLocaleDateString()}
                {blog.user && ` by ${blog.user.name}`}
            </p>
        )}


        {/* Buttons (Edit/Delete) - only if user is logged in */}
        <div className="mt-4 flex gap-4 text-sm">
          {localStorage.getItem("token") ? (
            // Assuming the logged-in user can only edit/delete their own blogs
            // You should add a check here like `blog.userId === yourLoggedInUserId`
            // For now, it shows if *any* user is logged in.
            <>
              {/* Navigate to edit page */}
              <Link
                to={`/edit/${blog.id}`}
                className="text-yellow-500 hover:underline"
              >
                Edit
              </Link>
              <button
                onClick={async () => {
                  if (window.confirm("Are you sure you want to delete this blog?")) {
                    try {
                      await deleteBlog(blog.id);
                      alert("Blog deleted successfully!");
                      // You might want to re-fetch blogs here or manage state removal in parent
                    } catch (deleteError) {
                      alert(`Failed to delete blog: ${deleteError.message}`);
                    }
                  }
                }}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default BlogItem;