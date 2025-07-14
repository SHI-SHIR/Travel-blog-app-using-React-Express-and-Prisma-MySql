import React, { useContext, useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import blogContext from "../context/blogContext";
import BlogItem from "./BlogItem";

const Blog = () => {
  const context = useContext(blogContext);
  const { blogs, getBlogs, editBlog } = context;

  const [blog, setBlog] = useState({ id: "", etitle: "", edescription: "", eimage: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const ref = useRef(null);
  const refClose = useRef(null);

  useEffect(() => {
    const fetchBlogs = async () => {

      await getBlogs();
      
      setLoading(false);
    };
    fetchBlogs();
  }, [getBlogs]);

  const updateBlog = (currentBlog) => {
    ref.current.click();
    setBlog({
      id: currentBlog.id,
      etitle: currentBlog.title,
      edescription: currentBlog.description,
      eimage: currentBlog.image,
    });
  };

  const handleClick = (e) => {
    e.preventDefault();
    editBlog(blog.id, blog.etitle, blog.edescription, blog.eimage);
    refClose.current.click();
  };

  const onChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

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
              <BlogItem key={blog.id} blog={blog} updateBlog={updateBlog} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Blog;
