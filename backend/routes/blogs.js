const express = require('express');
const Blog = require('../models/Blog');
const Image = require('../models/Image');
const fetchuser = require('../middleware/fetchuser');
const { check, validationResult } = require('express-validator');

const router = express.Router();

// 👉 GET all blogs
router.get('/fetchall', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 });
    res.json(blogs);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// 👉 POST create a new blog
// router.post('/add', fetchuser,
//   [
//     check('title', 'Title must be at least 3 characters').isLength({ min: 3 }),
//     check('description', 'Description must be at least 5 characters').isLength({ min: 5 }),
    
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res.status(400).json({ errors: errors.array() });

//     try {
//       const { title, description, image } = req.body;
//       console.log("Received image length:", image ? image.length : 0);


//       const blog = new Blog({
//         title,
//         description,
//         image,
//         user: req.user.id
//       });
//       const savedBlog = await blog.save();
//       res.json(savedBlog);
//     } catch (error) {
//       console.error(error.message);
//       res.status(500).send('Internal Server Error');
//     }
//   }
// );



router.post('/add', fetchuser,
  [
    check('title', 'Title must be at least 3 characters').isLength({ min: 3 }),
    check('description', 'Description must be at least 5 characters').isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      console.log("Headers:", req.headers);
      console.log("Body keys:", Object.keys(req.body));
      console.log("Title:", req.body.title);
      console.log("Description:", req.body.description);
      console.log("Image length:", req.body.image ? req.body.image.length : 0);

      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const { title, description, image } = req.body;

      const blog = new Blog({ title, description, image, user: req.user.id });
      await blog.save();
      res.json(blog);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);







   // 👉 GET single blog by ID
      router.get('/:id', async (req, res) => {
        try {
          const blog = await Blog.findById(req.params.id);
          if (!blog) return res.status(404).send("Blog not found");
          res.json(blog);
        } catch (error) {
          console.error(error.message);
          res.status(500).send('Internal Server Error');
        }
      });

// 👉 PUT update a blog
router.put('/update/:id', fetchuser, async (req, res) => {



  const { title, description, image } = req.body;

  const updatedBlog = {};
  if (title) updatedBlog.title = title;
  if (description) updatedBlog.description = description;
  if (image) updatedBlog.image = image;

  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).send("Blog not found");

    // Safe check before accessing .toString()
    if (!blog.user || blog.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, { $set: updatedBlog }, { new: true });
    res.json(blog);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});


// 👉 DELETE a blog
router.delete('/delete/:id', fetchuser, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).send("Blog not found");

    // Debugging: print user IDs
    console.log("✅ blog.user:", blog.user);
    console.log("✅ blog.user.toString():", blog.user ? blog.user.toString() : "undefined");
    console.log("✅ req.user.id:", req.user.id);

    // Ownership check
    if (!blog.user || blog.user.toString() !== req.user.id) {
      return res.status(401).send("🚫 Not allowed");
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Blog deleted successfully", blog });
  } catch (error) {
    console.error("❌ Error in delete route:", error.message);
    res.status(500).send("Internal Server Error");
  }
});



module.exports = router;
