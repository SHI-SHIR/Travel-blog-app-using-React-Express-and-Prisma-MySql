import express from 'express';
import { check, validationResult } from 'express-validator';
import prisma from '../prismaClient.js';
import fetchuser from '../middleware/fetchuser.js'; // Ensure this uses ES Module syntax

const router = express.Router();

// 👉 GET all blogs (sorted by date desc) with Pagination
// This endpoint now supports optional 'page' and 'limit' query parameters.
// Example: /api/blogs/fetchall?page=2&limit=5
router.get('/fetchall', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 blogs per page
    const skip = (page - 1) * limit; // Calculate how many records to skip

    // Use Prisma's $transaction to fetch blogs and total count efficiently in parallel
    const [blogs, totalBlogs] = await prisma.$transaction([
      prisma.blog.findMany({
        take: limit, // Number of records to take (limit)
        skip: skip,  // Number of records to skip (offset for pagination)
        orderBy: { date: 'desc' }, // Sort by date descending
        select: { // Explicitly select fields for efficiency
          id: true,
          title: true,
          description: true,
          image: true, // Assuming this is now a URL string
          date: true,
          userId: true, // Include userId for potential client-side checks
          user: { // Include specific user details
            select: { id: true, name: true, email: true }
          },
        },
      }),
      prisma.blog.count(), // Get the total count of all blogs for pagination metadata
    ]);

    // Send paginated response
    res.json({
      blogs,
      currentPage: page,
      totalPages: Math.ceil(totalBlogs / limit),
      totalBlogs,
    });
  } catch (error) {
    console.error("Error in /api/blogs/fetchall:", error); // Log the full error object
    res.status(500).json({ error: 'Internal Server Error' }); // Consistent JSON error response
  }
});

// 👉 POST create a new blog
router.post(
  '/add',
  fetchuser, // Middleware to authenticate the user
  [
    // Validation for title and description
    check('title', 'Title must be at least 3 characters').isLength({ min: 3 }),
    check('description', 'Description must be at least 5 characters').isLength({ min: 5 }),
    // Optional validation for image URL (assuming it's a URL now)
    check('image', 'Image must be a valid URL').optional().isURL(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Return validation errors
      }

      const { title, description, image } = req.body;

      // Note: The 'image' here should be the URL obtained from your image hosting service
      // (e.g., Google Drive, S3, Cloudinary) after the client has uploaded it.
      const blog = await prisma.blog.create({
        data: {
          title,
          description,
          image: image || '', // Store the URL or an empty string if not provided
          userId: req.user.id, // Get userId from the authenticated user
        },
      });
      res.status(201).json(blog); // Respond with 201 Created status and the new blog
    } catch (error) {
      console.error("Error creating blog:", error); // Log the full error object for debugging
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

// 👉 GET single blog by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid blog ID' }); // Validate ID format

    const blog = await prisma.blog.findUnique({
      where: { id },
      select: { // Explicitly select fields for efficiency
        id: true,
        title: true,
        description: true,
        image: true, // Assuming this is now a URL string
        date: true,
        userId: true,
        user: { // Include specific user details
          select: { id: true, name: true, email: true }
        },
      },
    });

    if (!blog) return res.status(404).json({ error: 'Blog not found' }); // Handle not found

    res.json(blog);
  } catch (error) {
    console.error(`Error fetching blog with ID ${req.params.id}:`, error); // Log the full error
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 👉 PUT update a blog
// Combines authorization check and update into one database operation.
router.put(
  '/update/:id',
  fetchuser,
  [
    // Validation for optional fields
    check('title', 'Title must be at least 3 characters').optional().isLength({ min: 3 }),
    check('description', 'Description must be at least 5 characters').optional().isLength({ min: 5 }),
    check('image', 'Image must be a valid URL').optional().isURL(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid blog ID' });

      const { title, description, image } = req.body;
      const updateData = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (image) updateData.image = image; // Assuming this is a URL

      // Attempt to update the blog where ID matches AND userId matches the current user.
      // updateMany returns { count: N }, where N is number of records updated.
      const result = await prisma.blog.updateMany({
        where: {
          id: id,
          userId: req.user.id, // Crucial: Ensures only the owner can update
        },
        data: updateData,
      });

      if (result.count === 0) {
        // If no records were updated, it means either:
        // 1. The blog ID does not exist.
        // 2. The blog exists, but the authenticated user is not its owner.
        const blogExists = await prisma.blog.count({ where: { id: id } }); // Check if blog exists regardless of owner
        if (blogExists === 0) {
          return res.status(404).json({ error: 'Blog not found' });
        } else {
          return res.status(401).json({ error: 'Not Allowed: You do not own this blog.' });
        }
      }

      // If the update was successful, fetch the newly updated blog to return it.
      // This is an additional query, but ensures the client gets the full updated object.
      const updatedBlog = await prisma.blog.findUnique({
        where: { id },
        select: { // Explicitly select fields for consistency
          id: true,
          title: true,
          description: true,
          image: true,
          date: true,
          userId: true,
          user: { select: { id: true, name: true, email: true } },
        },
      });

      res.json(updatedBlog);
    } catch (error) {
      console.error(`Error updating blog with ID ${req.params.id}:`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

// 👉 DELETE a blog
// Combines authorization check and deletion into one database operation.
router.delete('/delete/:id', fetchuser, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid blog ID' });

    // Optionally, fetch the blog *before* deleting it if you want to return its data.
    // If you just need a confirmation message, you can skip this findUnique.
    const blogToDelete = await prisma.blog.findUnique({ where: { id } });
    if (!blogToDelete) {
        return res.status(404).json({ error: 'Blog not found' });
    }

    // Attempt to delete the blog where ID matches AND userId matches the current user.
    const result = await prisma.blog.deleteMany({
      where: {
        id: id,
        userId: req.user.id, // Crucial: Ensures only the owner can delete
      },
    });

    if (result.count === 0) {
      // If no records were deleted, it means either:
      // 1. The blog ID did not exist (already handled by the findUnique above)
      // 2. The blog existed, but the authenticated user is not its owner.
      return res.status(401).json({ error: 'Not Allowed: You do not own this blog.' });
    }

    // Respond with success message and the data of the blog that was just deleted (if fetched)
    res.json({ message: '✅ Blog deleted successfully', deletedBlog: blogToDelete });
  } catch (error) {
    console.error(`❌ Error deleting blog with ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;