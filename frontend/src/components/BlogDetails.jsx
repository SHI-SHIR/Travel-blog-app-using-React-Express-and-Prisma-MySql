// import React from "react";
// import { useParams } from "react-router-dom";
// import Navbar from "./Navbar";

// // This would eventually come from your backend:
// const blogs = [ ]

// const BlogDetails = () => {
//   const { id } = useParams();
//   const blog = blogs.find((b) => b.id === id);

//   if (!blog) {
//     return <div className="text-center text-white mt-20">Blog not found</div>;
//   }

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-zinc-900 pt-24 p-8 text-black">
//         <div className="max-w-4xl mx-auto">
//           <img
//             src={blog.image}
//             alt={blog.title}
//             className="w-full h-96 object-cover rounded-lg mb-6"
//           />
//           <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
//           <p className="text-lg text-zinc-300 leading-relaxed">
//             {blog.description}
//           </p>
//         </div>
//       </div>
//     </>
//   );
// };

// export default BlogDetails;




// newww-------------------------
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import blogContext from "../context/blogContext";

const BlogDetails = () => {
  const { id } = useParams();
  const { fetchBlogById } = useContext(blogContext);
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const data = await fetchBlogById(id);
        setBlog(data);
      } catch (err) {
        setError("Blog not found");
      }
    };

    loadBlog();
  }, [id, fetchBlogById]);

  if (error) {
    return <div className="text-center text-black mt-20">{error}</div>;
  }

  if (!blog) {
    return <div className="text-center text-black mt-20">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-poppins pt-28 px-6 pb-10 text-black">
        <div className="max-w-4xl mx-auto">
          {/* Blog Image */}
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full max-h-[700px] object-contain rounded-lg mb-10"
          />

          {/* Blog Title */}
          <h1 className="text-4xl font-extrabold tracking-tight mb-8 text-zinc-800">
            {blog.title}
          </h1>

          {/* Blog Description */}
          <p
            className="text-lg text-zinc-700 leading-relaxed whitespace-pre-line"
          >
            {blog.description}
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-zinc-600 text-white py-1 px-6 mt-12">
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
