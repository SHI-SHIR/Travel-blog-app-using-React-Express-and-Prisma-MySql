import React, { useState, useMemo, useCallback } from "react";
import blogContext from "./blogContext";

// Define host outside the component to ensure it's a stable reference
const host = "http://localhost:5000"; // Update this to your backend URL if needed

// Read default limits from environment variables, or use a fallback if not set.
// For Create React App: process.env.REACT_APP_DEFAULT_BLOG_LIMIT
// For Vite: import.meta.env.VITE_DEFAULT_BLOG_LIMIT
const DEFAULT_BLOG_LIMIT = parseInt(process.env.REACT_APP_DEFAULT_BLOG_LIMIT || '10', 10);
const DEFAULT_IMAGE_LIMIT = parseInt(process.env.REACT_APP_DEFAULT_IMAGE_LIMIT || '20', 10);


const BlogState = (props) => {
  const [blogs, setBlogs] = useState([]);
  const [images, setImages] = useState([]); // This will now store paginated image data, not just an array of URLs
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State to hold pagination metadata for blogs
  const [blogPagination, setBlogPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBlogs: 0,
    limit: DEFAULT_BLOG_LIMIT, // Store the default limit here too
  });

  // State to hold pagination metadata for images
  const [imagePagination, setImagePagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalImages: 0,
    limit: DEFAULT_IMAGE_LIMIT, // Store the default limit here too
  });

  // Memoized function to get authentication headers
  const getAuthHeaders = useCallback(() => {
    return {
      "Content-Type": "application/json",
      "auth-token": localStorage.getItem("token") || "",
    };
  }, []); // Empty dependency array ensures it's created only once

  // ✅ Get all Blogs with Pagination Support
  // This function now accepts optional page and limit parameters.
  // It fetches blogs and updates both the 'blogs' state and 'blogPagination' state.
  const getBlogs = useCallback(async (page = 1, limit = DEFAULT_BLOG_LIMIT) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${host}/api/blogs/fetchall?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        // Attempt to parse specific error message from backend
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.error || `Failed to fetch blogs: ${response.statusText}`);
      }
      const data = await response.json(); // Backend now sends { blogs, currentPage, totalPages, totalBlogs }

      setBlogs(data.blogs); // Set the actual blog array for the current page
      setBlogPagination({ // Store all pagination metadata
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalBlogs: data.totalBlogs,
        limit: limit, // Store the limit used for this fetch
      });
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]); // Depends on getAuthHeaders (which is stable)

  // ✅ Get all Images with Pagination Support
  // This function now accepts optional page and limit parameters.
  // It fetches images and updates both the 'images' state and 'imagePagination' state.
  const getImages = useCallback(async (page = 1, limit = DEFAULT_IMAGE_LIMIT) => {
    setLoading(true);
    setError(null);
    try {
      // Use getAuthHeaders for consistency, even if Content-Type isn't strictly needed for GET
      const response = await fetch(`${host}/api/images/fetchall?page=${page}&limit=${limit}`, {
        headers: getAuthHeaders(), // Use the memoized function for consistent headers
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.error || `Failed to fetch images: ${response.statusText}`);
      }

      const data = await response.json(); // Backend now sends { images, currentPage, totalPages, totalImages }
      setImages(data.images); // Set the actual image array for the current page
      setImagePagination({ // Store all pagination metadata
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalImages: data.totalImages,
        limit: limit, // Store the limit used for this fetch
      });
    } catch (err) {
      console.error("Error fetching images:", err);
      setError(err.message);
      setImages([]); // Clear images on error
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]); // Depends on getAuthHeaders (which is stable)

  // ✅ Add a Blog
  // The 'image' parameter is expected to be a URL string directly provided by the user.
  const addBlog = useCallback(async (title, description, image) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${host}/api/blogs/add`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, description, image }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.error || `Failed to add blog: ${response.statusText}`);
      }
      const newBlog = await response.json();
      // Optimistically add the new blog to the current list.
      // For a paginated list, you might need to re-fetch the first page
      // or handle adding based on current sort/filter. For simplicity, just append.
      setBlogs((prevBlogs) => [...prevBlogs, newBlog]);
      return newBlog;
    } catch (err) {
      console.error("Error adding blog:", err);
      setError(err.message);
      throw err; // Re-throw error for the component to handle if needed
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  // ✅ Fetch blog by ID
  const fetchBlogById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${host}/api/blogs/${id}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.error || `Blog not found: ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      console.error(`Error fetching blog by ID ${id}:`, err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies for this specific fetch

  // ✅ Delete a Blog
  // Deletes a blog and updates the local state.
  const deleteBlog = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${host}/api/blogs/delete/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.error || `Failed to delete blog: ${response.statusText}`);
      }
      // Assuming backend now returns { message, deletedBlog } on success
      const result = await response.json();
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id)); // Remove from local state
      return result.message; // Return success message
    } catch (err) {
      console.error(`Error deleting blog ${id}:`, err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  // ✅ Edit a Blog
  // Edits an existing blog and updates the local state.
  // The 'image' parameter is expected to be a URL string.
  const editBlog = useCallback(async (id, title, description, image) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${host}/api/blogs/update/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, description, image }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.error || `Failed to edit blog: ${response.statusText}`);
      }
      const updatedBlog = await response.json();
      // Update the specific blog in the local state
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) => (blog.id === id ? updatedBlog : blog))
      );
      return updatedBlog;
    } catch (err) {
      console.error(`Error editing blog ${id}:`, err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  // Memoize the context value to prevent unnecessary re-renders of consumers.
  // Ensure all relevant state variables and memoized functions are included in dependencies.
  const contextValue = useMemo(
    () => ({
      blogs,
      images,
      loading,
      error,
      blogPagination, // Expose blog pagination metadata
      imagePagination, // Expose image pagination metadata
      getBlogs,
      getImages,
      addBlog,
      deleteBlog,
      editBlog,
      fetchBlogById,
    }),
    [
      blogs, images, loading, error, // State values
      blogPagination, imagePagination, // New pagination states
      getBlogs, getImages, addBlog, deleteBlog, editBlog, fetchBlogById // Memoized functions
    ]
  );

  return (
    <blogContext.Provider value={contextValue}>
      {props.children}
    </blogContext.Provider>
  );
};

export default BlogState;