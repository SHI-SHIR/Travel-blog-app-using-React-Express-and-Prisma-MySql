import React, { useState } from "react";
import blogContext from "./blogContext";

const BlogState = (props) => {
  const host = "http://localhost:5000";
  const blogsInitial = [];

  const [blogs, setBlogs] = useState(blogsInitial);
  const [images, setImages] = useState([]);

  // ✅ Get all Blogs
  const getBlogs = async () => {
    const response = await fetch(`${host}/api/blogs/fetchall`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });

    const blogs = await response.json();
    setBlogs(blogs);
  };
  

const getImages = async () => {
  try {
    const response = await fetch(`${host}/api/images/fetchall`, {
      headers: { "auth-token": localStorage.getItem("token") || "" },
    });

    if (!response.ok) {
      console.error("Failed to fetch images, status:", response.status);
      setImages([]); // clear images on failure or keep previous if you want
      return;
    }

    const data = await response.json();
    console.log("Fetched images:", data); // Debug: see what you get
    setImages(data);
  } catch (error) {
    console.error("Error fetching images:", error);
    setImages([]); // clear images or handle as needed
  }
};


  // ✅ Add a Blog
  const addBlog = async (title, description, image) => {
    try {
      const response = await fetch(`${host}/api/blogs/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ title, description, image }),
      });
      const data = await response.json();
      console.log("Add blog response:", data);
      setBlogs((prev) => [...prev, data]);
      return data;
    } catch (error) {
      console.error("Add blog failed:", error);
    }
  };

  // ✅ Fetch blog by ID
  const fetchBlogById = async (id) => {
    try {
      const response = await fetch(`${host}/api/blogs/${id}`);
      if (!response.ok) {
        throw new Error("Blog not found");
      }
      const blog = await response.json();
      return blog;
    } catch (err) {
      console.error("Fetch blog failed:", err.message);
      throw err;
    }
  };

  // ✅ Delete a Blog
  const deleteBlog = async (id) => {
    await fetch(`${host}/api/blogs/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });

    const newBlogs = blogs.filter((blog) => blog.id !== id);
    setBlogs(newBlogs);
  };

  // ✅ Edit a Blog
  const editBlog = async (id, title, description, image) => {
    await fetch(`${host}/api/blogs/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, image }),
    });

    const newBlogs = JSON.parse(JSON.stringify(blogs));
    for (let index = 0; index < newBlogs.length; index++) {
      if (newBlogs[index].id === id) {
        newBlogs[index].title = title;
        newBlogs[index].description = description;
        newBlogs[index].image = image;
        break;
      }
    }
    setBlogs(newBlogs);
  };

  return (
    <blogContext.Provider
      value={{
        blogs,
        getBlogs,
        addBlog,
        deleteBlog,
        editBlog,
        fetchBlogById,
        images,
        getImages,
      }}
    >
      {props.children}
    </blogContext.Provider>
  );
};

export default BlogState;
