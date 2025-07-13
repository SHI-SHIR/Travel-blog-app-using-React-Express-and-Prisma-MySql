import express from 'express';
import { check, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// POST /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Enter a valid email').isEmail(),
    check('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user || user.password !== password) {
        return res.status(400).json({ success, error: 'Invalid credentials' });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(payload, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
  }
);

export default router;
