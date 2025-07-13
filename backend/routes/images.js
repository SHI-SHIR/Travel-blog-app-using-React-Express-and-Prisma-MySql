import express from 'express';
import prisma from '../prismaClient.js';

const router = express.Router();

router.get('/fetchall', async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      select: { image: true },
      where: {
        image: { not: "" }  // exclude empty images
      }
    });

    const images = blogs.map(blog => blog.image);

    res.json(images);
  } catch (error) {
    console.error("Error in /api/images/fetchall:", error);
    res.status(500).send("Internal Server Error");
  }
});


export default router;
