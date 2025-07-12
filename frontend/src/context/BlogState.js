// import React, { useState } from "react";
// import blogContext from "./blogContext";

// const BlogState = (props) => {
//   const host = "http://localhost:5000";
//   const blogsInitial = [];

//   const [blogs, setBlogs] = useState(blogsInitial);

//   // ✅ Get all Blogs
//   const getBlogs = async () => {
//     const response = await fetch(`${host}/api/blogs/fetchall`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         "auth-token": localStorage.getItem("token"),
//       },
//     });

//     const blogs = await response.json();
//     setBlogs(blogs);
//   };

//    // Fetch all images
//   const getImages = async () => {
//     const response = await fetch(`${host}/api/images/fetchall`, {
//       headers: { "auth-token": localStorage.getItem("token") || "" },
//     });
//     const data = await response.json();
//     setImages(data);
//   };


//   // ✅ Add a Blog
// //   const addBlog = async (title, description, image) => {
// //   const response = await fetch(`${host}/api/blogs/add`, {
// //     method: "POST",
// //     headers: {
// //       "Content-Type": "application/json",
// //       "auth-token": localStorage.getItem("token"),
// //     },
// //     body: JSON.stringify({ title, description, image }),
// //   });

// //   const blog = await response.json();
// //   setBlogs(prev => [...prev, blog]); // Update local state if needed
// // };

// const addBlog = async (title, description, image) => {
//   try {
//     const response = await fetch(`${host}/api/blogs/add`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "auth-token": localStorage.getItem("token"),
//       },
//       body: JSON.stringify({ title, description, image }),
//     });
//     const data = await response.json();
//     console.log("Add blog response:", data);
//     setBlogs(prev => [...prev, data]);
//     return data;
//   } catch (error) {
//     console.error("Add blog failed:", error);
//   }
// };






// // ✅ Add inside BlogState.js above the return()
// const fetchBlogById = async (id) => {
//   try {
//     const response = await fetch(`${host}/api/blogs/${id}`);
//     if (!response.ok) {
//       throw new Error("Blog not found");
//     }
//     const blog = await response.json();
//     return blog; // return the fetched blog
//   } catch (err) {
//     console.error("Fetch blog failed:", err.message);
//     throw err;
//   }
// };




//   // ✅ Delete a Blog
//   const deleteBlog = async (id) => {
//     await fetch(`${host}/api/blogs/delete/${id}`, {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//         "auth-token": localStorage.getItem("token"),
//       },
//     });

//     const newBlogs = blogs.filter((blog) => blog._id !== id);
//     setBlogs(newBlogs);
//   };

//   // ✅ Edit a Blog
//   const editBlog = async (id, title, description, image) => {
//     await fetch(`${host}/api/blogs/update/${id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         "auth-token": localStorage.getItem("token"),
//       },
//       body: JSON.stringify({ title, description, image }),
//     });

//     const newBlogs = JSON.parse(JSON.stringify(blogs));
//     for (let index = 0; index < newBlogs.length; index++) {
//       const element = newBlogs[index];
//       if (element._id === id) {
//         newBlogs[index].title = title;
//         newBlogs[index].description = description;
//         newBlogs[index].image = image; // ❗️ was mistakenly using `tag`
//         break;
//       }
//     }
//     setBlogs(newBlogs);
//   };

//   return (
//     <blogContext.Provider
//       value={{
//         blogs,
//         getBlogs,
//         addBlog,
//         deleteBlog,
//         editBlog,
//         fetchBlogById,
//       }}
//     >
//       {props.children}
//     </blogContext.Provider>
//   );
// };

// export default BlogState;






//---------------------new-----------------------
import React, { useState } from "react";
import blogContext from "./blogContext";

const BlogState = (props) => {
  const host = "https://mern-travel-blog-web-app.onrender.com";
  const blogsInitial = [];

  const [blogs, setBlogs] = useState(blogsInitial);
  const [images, setImages] = useState([]); // <-- Add images state here

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

  // Fetch all images
  const getImages = async () => {
    const response = await fetch(`${host}/api/images/fetchall`, {
      headers: { "auth-token": localStorage.getItem("token") || "" },
    });
    const data = await response.json();
    setImages(data);
  };

  // ✅ Add a Blog
  const addBlog = async (title, description, image) => {
    console.log("Sending token:", localStorage.getItem("token"));

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

    const newBlogs = blogs.filter((blog) => blog._id !== id);
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
      const element = newBlogs[index];
      if (element._id === id) {
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
        images,     // <-- provide images state
        getImages,  // <-- provide getImages function
      }}
    >
      {props.children}
    </blogContext.Provider>
  );
};

export default BlogState;
