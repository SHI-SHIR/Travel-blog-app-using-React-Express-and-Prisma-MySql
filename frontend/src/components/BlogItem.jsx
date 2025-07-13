import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import blogContext from "../context/blogContext";

const BlogItem = ({ blog, updateBlog }) => {
  const { deleteBlog } = useContext(blogContext);
  const navigate = useNavigate();

  const truncateDesc = (desc, length = 150) =>
    desc.length > length ? desc.slice(0, length) + "..." : desc;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col cursor-pointer hover:shadow-xl transition-shadow duration-300">
      {/* Image container */}
      <div
        className="aspect-16-9 overflow-hidden relative"
        onClick={() => navigate(`/blog/${blog.id}`)}
      >
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110 hover:brightness-75"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-black font-bold text-xl mb-2">{blog.title}</h3>

        <p className="text-black flex-grow">
          {truncateDesc(blog.description || "No description available")}
          {blog.description && blog.description.length > 150 && (
            <Link
              to={`/blog/${blog.id}`}
              className="text-blue-600 hover:underline ml-1"
            >
              Read more
            </Link>
          )}
        </p>

        {/* Buttons */}
        <div className="mt-4 flex gap-4 text-sm">
          {localStorage.getItem("token") ? (
            <>
              <Link
                to={`/edit/${blog.id}`}
                className="text-yellow-500 hover:underline"
              >
                Edit
              </Link>
              <button
                onClick={() => deleteBlog(blog.id)}
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
