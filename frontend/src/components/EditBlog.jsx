import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import blogContext from "../context/blogContext";
import Navbar from "./Navbar";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { blogs, editBlog } = useContext(blogContext);

  const [blog, setBlog] = useState({
    title: "",
    description: "",
    image: "", // base64 string
  });

  useEffect(() => {
    const blogId = Number(id); // Convert id to number
    const selectedBlog = blogs.find((b) => b.id === blogId);
    if (selectedBlog) {
      setBlog({
        title: selectedBlog.title,
        description: selectedBlog.description,
        image: selectedBlog.image || "",
      });
    } else {
      console.error("Blog not found in context");
    }
  }, [id, blogs]);

  // Convert file to base64 helper
  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });

  // Handle inputs and file upload
  const onChange = async (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      if (file) {
        const base64 = await convertToBase64(file);
        setBlog({ ...blog, image: base64 });
      }
    } else {
      setBlog({ ...blog, [e.target.name]: e.target.value });
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    await editBlog(Number(id), blog.title, blog.description, blog.image);
    navigate("/blog");
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center items-center min-h-screen font-space">
        <h1 className="text-3xl mt-10 mb-6">Edit Blog</h1>

        <form
          onSubmit={handleClick}
          className="flex flex-col space-y-6 w-full max-w-4xl bg-white p-6 rounded-lg shadow-md"
        >
          {/* Title */}
          <input
            className="w-full px-5 py-3 border-2 border-zinc-800 bg-transparent outline-none rounded-lg text-lg"
            type="text"
            name="title"
            id="title"
            value={blog.title}
            onChange={onChange}
            placeholder="Blog Title"
            required
          />

          {/* Description */}
          <textarea
            name="description"
            id="description"
            placeholder="Update blog description..."
            rows={10}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 500)}px`;
            }}
            className="w-full px-5 py-4 text-lg border-2 border-zinc-800 bg-transparent outline-none rounded-lg overflow-y-auto resize-none"
            value={blog.description}
            onChange={onChange}
            style={{ maxHeight: "500px" }}
            required
          />

          {/* File input for image */}
          <input
            className="w-full px-5 py-3 border-2 border-zinc-800 bg-transparent outline-none rounded-lg text-lg"
            type="file"
            name="image"
            id="image"
            accept="image/*"
            onChange={onChange}
          />

          {/* Image preview */}
          {blog.image && (
            <img
              src={blog.image}
              alt="Blog Preview"
              className="mt-4 max-h-64 object-contain rounded-md border border-gray-300"
            />
          )}

          {/* Submit Button */}
          <input
            className="w-full px-5 py-3 bg-yellow-600 hover:bg-yellow-700 text-white text-lg font-semibold rounded-lg cursor-pointer"
            type="submit"
            value="Update Blog"
          />
        </form>
      </div>
    </>
  );
};

export default EditBlog;
