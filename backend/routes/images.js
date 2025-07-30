import express from 'express';
import prisma from '../prismaClient.js';

const router = express.Router();

// 👉 GET all image URLs from the Blog database
// This endpoint now supports optional 'page' and 'limit' query parameters for pagination.
// Example: /api/images/fetchall?page=2&limit=20
router.get('/fetchall', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 20; // Default to 20 images per page
    const skip = (page - 1) * limit; // Calculate how many records to skip

    // Fetch a paginated subset of image URLs and the total count of valid images.
    // Using prisma.$transaction to run both queries concurrently for efficiency.
    const [blogsWithImages, totalImagesCount] = await prisma.$transaction([
      prisma.blog.findMany({
        take: limit, // Number of records to take per page
        skip: skip,  // Number of records to skip (offset for pagination)
        select: { image: true }, // Select only the 'image' field for performance
        where: {
          image: { not: "" }  // Exclude records where image URL is empty
        },
        orderBy: { id: 'desc' } // Order results (e.g., by ID, or by date if a date field existed on Image)
      }),
      // Count all blogs that have a non-empty image URL to determine total pages
      prisma.blog.count({
        where: { image: { not: "" } }
      })
    ]);

    // Extract just the image URLs from the fetched blog objects
    const images = blogsWithImages.map(blog => blog.image);

    // Respond with the paginated image URLs and pagination metadata
    res.json({
      images,
      currentPage: page,
      totalPages: Math.ceil(totalImagesCount / limit),
      totalImages: totalImagesCount,
    });

  } catch (error) {
    // Log the full error object for detailed debugging on the server
    console.error("Error in /api/images/fetchall:", error);
    // Send a consistent JSON error response to the client
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;