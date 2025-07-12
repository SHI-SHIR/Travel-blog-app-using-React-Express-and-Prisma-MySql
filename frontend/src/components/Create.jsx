// import React, { useState, useContext } from "react";
// import Navbar from "./Navbar";
// import blogContext from "../context/blogContext";
// import { useNavigate } from 'react-router-dom';

// const Create = () => {
//   const context = useContext(blogContext);
//   const { addBlog } = context;

//   let navigate = useNavigate();

//   const [blog, setBlog] = useState({
//     title: "",
//     description: "",
//     image: "", // image will be stored as a base64 string
//   });

//  const handleClick = async (e) => {
//   e.preventDefault();
//   await addBlog(blog.title, blog.description, blog.image);
//   setBlog({ title: "", description: "", image: "" });
//   navigate('/blog');
// };


//   const onChange = async (e) => {
//     if (e.target.name === "image") {
//       const file = e.target.files[0];
//       if (file) {
//         const base64 = await convertToBase64(file);
//         console.log("Base64 length:", base64.length);

//         setBlog({ ...blog, image: base64 });
//       }
//     } else {
//       setBlog({ ...blog, [e.target.name]: e.target.value });
//     }
//   };

//   function convertToBase64(file) {
//     return new Promise((resolve, reject) => {
//       const fileReader = new FileReader();
//       fileReader.readAsDataURL(file);
//       fileReader.onload = () => resolve(fileReader.result);
//       fileReader.onerror = (error) => reject(error);
//     });
//   }

//   return (
//     <>
//       <Navbar />
//       <div className="flex flex-col justify-center items-center h-screen v-screen">
//         <h1 className="text-3xl mt-30 mb-3">Create Blog</h1>

//         <form
//           action="/"
//           onSubmit={handleClick}
//           className="flex flex-col space-y-6 w-full max-w-4xl bg-white p-6 rounded-lg shadow-md"
//           encType="multipart/form-data"
//         >
//           <input
//             className="w-full px-5 py-3 border-2 border-zinc-800 bg-transparent outline-none rounded-lg text-lg"
//             type="text"
//             name="title"
//             id="title"
//             value={blog.title}
//             onChange={onChange}
//             placeholder="Blog Title"
//           />

//           <textarea
//             name="description"
//             id="description"
//             placeholder="Write your blog description here..."
//             rows={10}
//             onInput={(e) => {
//               e.target.style.height = "auto";
//               e.target.style.height = `${Math.min(
//                 e.target.scrollHeight,
//                 500
//               )}px`;
//             }}
//             className="w-full px-5 py-4 text-lg border-2 border-zinc-800 bg-transparent outline-none rounded-lg overflow-y-auto resize-none"
//             value={blog.description}
//             onChange={onChange}
//             style={{ maxHeight: "500px" }}
//           />

//           {/* File input for image */}
//           <input
//             className="w-full px-5 py-3 border-2 border-zinc-800 bg-transparent outline-none rounded-lg text-lg"
//             type="file"
//             name="image"
//             id="image"
//             accept="image/*"
//             onChange={onChange}
//           />

//           <input
//             className="w-full px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg cursor-pointer"
//             type="submit"
//             value="Create Blog"
//           />
//         </form>
//       </div>
//     </>
//   );
// };

// export default Create;







//------------------------new code---------------------
import React, { useState, useContext } from "react";
import Navbar from "./Navbar";
import blogContext from "../context/blogContext";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const context = useContext(blogContext);
  const { addBlog } = context;

  let navigate = useNavigate();

  const [blog, setBlog] = useState({
    title: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();

    if (!blog.title.trim() || !blog.description.trim()) {
      alert("Please enter a title and description.");
      return;
    }

    await addBlog(blog.title, blog.description, blog.image);
    setBlog({ title: "", description: "", image: "" });
    navigate("/blog");
  };

  const onChange = async (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      if (file) {
        setLoading(true);
        const base64 = await convertToBase64(file);
        setBlog({ ...blog, image: base64 });
        setLoading(false);
      }
    } else {
      setBlog({ ...blog, [e.target.name]: e.target.value });
    }
  };

  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h1 className="text-3xl mt-10 mb-3">Create Blog</h1>

        <form
          action="/"
          onSubmit={handleClick}
          className="flex flex-col space-y-6 w-full max-w-4xl bg-white p-6 rounded-lg shadow-md"
        >
          <input
            className="w-full px-5 py-3 border-2 border-zinc-800 bg-transparent outline-none rounded-lg text-lg"
            type="text"
            name="title"
            id="title"
            value={blog.title}
            onChange={onChange}
            placeholder="Blog Title"
          />

          <textarea
            name="description"
            id="description"
            placeholder="Write your blog description here..."
            rows={10}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 500)}px`;
            }}
            className="w-full px-5 py-4 text-lg border-2 border-zinc-800 bg-transparent outline-none rounded-lg overflow-y-auto resize-none"
            value={blog.description}
            onChange={onChange}
            style={{ maxHeight: "500px" }}
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

          <input
            disabled={loading}
            className={`w-full px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg cursor-pointer ${
              loading ? "cursor-not-allowed" : ""
            }`}
            type="submit"
            value="Create Blog"
          />
        </form>
      </div>
    </>
  );
};

export default Create;

