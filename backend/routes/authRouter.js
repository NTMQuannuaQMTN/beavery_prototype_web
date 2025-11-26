import express from 'express';
import { verifyAuth } from '../middleware/auth.js';
import { supabase } from '../lib/supabase.js';

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

/**
 * Create user in the database
 * POST /auth/create-user
 * Requires: Bearer token in Authorization header
 * Body: { name: string }
 * Creates a row in public.users with: id, name, email, created_at
 */
router.post('/create-user', verifyAuth, async (req, res) => {
  try {
    const { name } = req.body;
    const userEmail = req.user.email;
    const userId = req.user.id;

    // Validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ 
        error: 'Name is required' 
      });
    }

    const trimmedName = name.trim();

    // Insert user into database
    // The database will handle: created_at (default timestamp)
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: userId,  // Use the auth user ID
        email: userEmail,
        name: trimmedName,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      
      // Handle duplicate key error (user already exists)
      if (error.code === '23505') {
        return res.status(409).json({ 
          error: 'User already exists' 
        });
      }

      return res.status(500).json({ 
        error: 'Failed to create user',
        details: error.message || 'Database error',
        code: error.code
      });
    }

    // Success
    res.status(200).json({
      message: 'User created successfully',
      user: data
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ 
      error: 'An unexpected error occurred',
      details: error.message
    });
  }
});

export default router;

