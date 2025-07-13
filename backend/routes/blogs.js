import express from 'express';
import { check, validationResult } from 'express-validator';
import prisma from '../prismaClient.js';
import fetchuser from '../middleware/fetchuser.js';

const router = express.Router();

// 👉 GET all blogs (sorted by date desc)
router.get('/fetchall', async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { date: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    res.json(blogs);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// 👉 POST create a new blog
router.post(
  '/add',
  fetchuser,
  [
    check('title', 'Title must be at least 3 characters').isLength({ min: 3 }),
    check('description', 'Description must be at least 5 characters').isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { title, description, image } = req.body;



      const blog = await prisma.blog.create({
        data: {
          title,
          description,
          image,
          userId: req.user.id,
        },
      });
      res.json(blog);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
);

// 👉 GET single blog by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).send('Invalid blog ID');

    const blog = await prisma.blog.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!blog) return res.status(404).send('Blog not found');

    res.json(blog);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// 👉 PUT update a blog
router.put('/update/:id', fetchuser, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).send('Invalid blog ID');

    const { title, description, image } = req.body;
    const updatedBlog = {};
    if (title) updatedBlog.title = title;
    if (description) updatedBlog.description = description;
    if (image) updatedBlog.image = image;

    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) return res.status(404).send('Blog not found');

    if (blog.userId !== req.user.id) {
      return res.status(401).send('Not Allowed');
    }

    const updated = await prisma.blog.update({
      where: { id },
      data: updatedBlog,
    });

    res.json(updated);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// 👉 DELETE a blog
router.delete('/delete/:id', fetchuser, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).send('Invalid blog ID');

    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) return res.status(404).send('Blog not found');

    console.log('✅ blog.userId:', blog.userId);
    console.log('✅ req.user.id:', req.user.id);

    if (blog.userId !== req.user.id) {
      return res.status(401).send('🚫 Not allowed');
    }

    await prisma.blog.delete({ where: { id } });
    res.json({ message: '✅ Blog deleted successfully', blog });
  } catch (error) {
    console.error('❌ Error in delete route:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
