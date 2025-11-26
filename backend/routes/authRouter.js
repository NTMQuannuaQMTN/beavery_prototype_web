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
 * Create or update user in the database
 * POST /auth/create-user
 * Requires: Bearer token in Authorization header
 * Body: { name: string }
 */
router.post('/create-user', verifyAuth, async (req, res) => {
  try {
    const { name } = req.body;
    const userEmail = req.user.email;

    // Validation
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ 
        error: 'Name is required and must be a string' 
      });
    }

    const trimmedName = name.trim();

    // Business rules validation
    if (trimmedName.length === 0) {
      return res.status(400).json({ 
        error: 'Name cannot be empty' 
      });
    }

    if (trimmedName.length > 255) {
      return res.status(400).json({ 
        error: 'Name is too long (max 255 characters)' 
      });
    }

    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('email, name')
      .eq('email', userEmail)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 means no rows found, which is fine for new users
      console.error('Error fetching user:', fetchError);
      return res.status(500).json({ 
        error: 'Failed to check user existence' 
      });
    }

    let result;

    if (existingUser) {
      // User exists, update the name
      const { data, error: updateError } = await supabase
        .from('users')
        .update({ 
          name: trimmedName,
          updated_at: new Date().toISOString() // If you add this column later
        })
        .eq('email', userEmail)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating user:', updateError);
        return res.status(500).json({ 
          error: 'Failed to update user' 
        });
      }

      result = data;
    } else {
      // User doesn't exist, create new user
      const { data, error: insertError } = await supabase
        .from('users')
        .insert({
          email: userEmail,
          name: trimmedName,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user:', insertError);
        
        // Handle unique constraint violation
        if (insertError.code === '23505') {
          return res.status(409).json({ 
            error: 'User already exists' 
          });
        }

        return res.status(500).json({ 
          error: 'Failed to create user' 
        });
      }

      result = data;
    }

    // Update auth metadata using service role key
    try {
      const { error: metadataError } = await supabase.auth.admin.updateUserById(
        req.user.id,
        { user_metadata: { name: trimmedName } }
      );
      if (metadataError) {
        console.warn('Failed to update auth metadata:', metadataError);
      }
    } catch (metadataError) {
      // Log but don't fail - database update is more important
      console.warn('Failed to update auth metadata:', metadataError);
    }

    res.status(200).json({
      message: existingUser ? 'User updated successfully' : 'User created successfully',
      user: {
        email: result.email,
        name: result.name,
        created_at: result.created_at,
      }
    });

  } catch (error) {
    console.error('Unexpected error in create-user:', error);
    res.status(500).json({ 
      error: 'An unexpected error occurred' 
    });
  }
});

export default router;

