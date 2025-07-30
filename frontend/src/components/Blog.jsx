import React, { useContext, useEffect } from "react"; // Removed useRef, useState
import Navbar from "./Navbar";
// import { useNavigate } from "react-router-dom"; // No longer directly used in this component's logic
import blogContext from "../context/blogContext"; // Ensure path is correct
import BlogItem from "./BlogItem";

const Blog = () => {
  // Destructure relevant data and functions from context
  const {
    blogs,
    loading, // Use global loading state from context
    error, // Use global error state from context
    getBlogs,
    blogPagination, // Get pagination metadata from context
  } = useContext(blogContext);

  // useEffect to fetch blogs when the component mounts
  // It will run once on mount because getBlogs is memoized (stable)
  // and we explicitly set the initial page and limit.
  useEffect(() => {
    // Call getBlogs with the default page (1) and limit from context
    // The default limit is pulled from env in BlogState.js
    getBlogs(blogPagination.currentPage, blogPagination.limit);
  }, [getBlogs, blogPagination.currentPage, blogPagination.limit]); // Re-fetch when page/limit changes

  // Handler for changing pagination page
  const handlePageChange = (newPage) => {
    // Only attempt to fetch if the new page is within valid bounds
    if (newPage >= 1 && newPage <= blogPagination.totalPages) {
      getBlogs(newPage, blogPagination.limit);
    }
  };

  // --- Conditional Rendering for Loading, Error, No Blogs ---
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen text-black text-xl">
          Loading blogs...
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen text-red-600 text-xl">
          Error: {error}
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen font-poppins bg-white p-10 pt-24 text-black">
        <h1 className="text-3xl font-bold mb-3 mt-10">Blogs:</h1>
        <hr className="mb-6 border-zinc-700" />

        {blogs.length === 0 ? (
          <p>No blogs found. Create one!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              // updateBlog prop is no longer passed if not used for modal edit
              <BlogItem key={blog.id} blog={blog} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {blogPagination.totalPages > 1 && ( // Only show controls if there's more than one page
          <div className="flex justify-center items-center mt-10 space-x-4">
            <button
              onClick={() => handlePageChange(blogPagination.currentPage - 1)}
              disabled={blogPagination.currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-lg text-black">
              Page {blogPagination.currentPage} of {blogPagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(blogPagination.currentPage + 1)}
              disabled={
                blogPagination.currentPage === blogPagination.totalPages
              }
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Blog;
