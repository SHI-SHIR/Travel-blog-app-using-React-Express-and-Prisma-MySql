import prisma from './prismaClient.js'; // adjust path if needed

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log("Users:", users);

    const blogs = await prisma.blog.findMany();
    console.log("Blogs:", blogs);
  } catch (err) {
    console.error("Error querying database:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
