import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar"; // Ensure path is correct
import blogContext from "../context/blogContext"; // Ensure path is correct

const BlogDetails = () => {
  const { id } = useParams();
  const { fetchBlogById, setLoading, setError } = useContext(blogContext); // Destructure setLoading/setError from context if you manage them globally
  const [blog, setBlog] = useState(null);
  const [loadingLocal, setLoadingLocal] = useState(true); // Local loading state for this component
  const [errorLocal, setErrorLocal] = useState(null); // Local error state for this component

  useEffect(() => {
    const loadBlog = async () => {
      setLoadingLocal(true); // Start local loading
      setErrorLocal(null);   // Clear local error
      try {
        const data = await fetchBlogById(id);
        setBlog(data);
      } catch (err) {
        console.error("Error loading blog details:", err);
        setErrorLocal(err.message || "Blog not found or an error occurred."); // Use err.message for more detail
      } finally {
        setLoadingLocal(false); // End local loading
      }
    };

    loadBlog();
  }, [id, fetchBlogById]); // Dependencies: id from URL params, and the fetch function

  // Fallback image URL for broken links
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop if fallback also fails
    e.target.src = "https://via.placeholder.com/800x450?text=Image+Not+Available"; // Placeholder image
  };

  // Set document title dynamically
  useEffect(() => {
    if (blog && blog.title) {
      document.title = `${blog.title} | Talk to Local Blog`;
    } else {
      document.title = "Blog Details | Talk to Local";
    }
  }, [blog]);

  if (loadingLocal) { // Use local loading state
    return (
      <>
        <Navbar />
        <div className="text-center text-black mt-20 pt-28">Loading blog details...</div>
      </>
    );
  }

  if (errorLocal) { // Use local error state
    return (
      <>
        <Navbar />
        <div className="text-center text-red-600 mt-20 pt-28">{errorLocal}</div>
      </>
    );
  }

  if (!blog) {
    // This case should ideally be caught by errorLocal if fetchBlogById fails to find.
    // But as a fallback, if blog is null and no error, maybe it's still loading or redirected.
    return (
      <>
        <Navbar />
        <div className="text-center text-black mt-20 pt-28">No blog data available.</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-poppins pt-28 px-6 pb-10 text-black">
        <div className="max-w-4xl mx-auto">
          {/* Blog Image */}
          <img
            src={blog.image} // Assumes blog.image is a URL
            alt={blog.title || "Blog Image"} // Alt text fallback
            className="w-full max-h-[700px] object-contain rounded-lg mb-10"
            onError={handleImageError} // Added error handler for images
          />

          {/* Blog Title */}
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-zinc-800">
            {blog.title}
          </h1>

          {/* Author and Date Information */}
          {blog.user && (
            <p className="text-gray-600 text-sm mb-6">
              By <span className="font-semibold">{blog.user.name}</span> on{" "}
              {new Date(blog.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}

          {/* Blog Description */}
          <p
            className="text-lg text-zinc-700 leading-relaxed whitespace-pre-line"
          >
            {blog.description}
          </p>
        </div>
      </div>

      {/* Footer (moved out of component for reusability if not dynamic) */}
      <footer className="bg-zinc-600 text-white py-4 px-6 mt-12"> {/* Increased padding slightly */}
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <h2 className="text-xl font-semibold tracking-wide">Talk to Local</h2>
          <p className="text-sm text-gray-300">
            Capturing raw stories from real people and hidden places.
          </p>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Talk to Local. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default BlogDetails;