const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog'); // your blog model

// GET /api/images/fetchall
// Return all images from blogs (public or with auth, your choice)
router.get('/fetchall', async (req, res) => {
  try {
    const blogs = await Blog.find({}, 'image'); // fetch only image field
    const images = blogs.map(blog => blog.image).filter(Boolean); // get images, remove null/undefined
    res.json(images);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
