import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import Navbar from "./Navbar";
import blogContext from "../context/blogContext";
import BlogItem from "./BlogItem";

const Blog = () => {
  // Destructure relevant data and functions from context
  const {
    blogs,
    getBlogs,
    // We no longer need loading, error, or blogPagination from context
  } = useContext(blogContext);

  // useEffect to fetch blogs when the component mounts.
  // It will run once on mount.
  useEffect(() => {
    // Fetch all blogs without pagination
    getBlogs();
  }, [getBlogs]);

  // --- No Loading or Error States as per request ---

  // Determine the blogs to display
  const blogsToShow = blogs.slice(0, 6);

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen font-poppins bg-white p-10 pt-24 text-black">
        {/* The title "Blogs:" and the <hr> have been removed as per the request */}
        
        {blogs.length === 0 ? (
          <p>No blogs found. Create one!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {blogsToShow.map((blog) => (
              <BlogItem key={blog.id} blog={blog} />
            ))}
          </div>
        )}

        {/* "See more blogs" link */}
        {blogs.length > 6 && (
          <div className="text-center mt-10">
            <Link to="/blog" className="text-lg italic text-blue-600 hover:underline">
              See more blogs
            </Link>
          </div>
        )}

        {/* All pagination has been removed as per the request */}
      </div>
    </>
  );
};

export default Blog;