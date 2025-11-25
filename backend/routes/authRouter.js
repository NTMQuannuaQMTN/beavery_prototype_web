import express from 'express';
import { verifyAuth } from '../middleware/auth.js';

const router = express.Router();

// Test route - no auth required
router.get('/test', (req, res) => {
  res.json({ message: 'Auth router is working!' });
});

// Protected route example - requires authentication
router.get('/me', verifyAuth, (req, res) => {
  res.json({ 
    message: 'You are authenticated!',
    user: {
      id: req.user.id,
      email: req.user.email,
    }
  });
});

export default router;

