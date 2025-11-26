import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001; // Backend on 3001, Next.js on 3000

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Next.js default port
  credentials: true
}));
app.use(express.json());

// Request logging middleware (optional - remove if too verbose)
// app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
//   next();
// });

// Routes
app.use('/auth', authRouter);

// Health check
app.get('/api', (req, res) => {
    res.status(200).json({ message: 'Hello from Beavery backend!' });
});

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    details: err.message || 'An unexpected error occurred'
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path
  });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`Health check: http://localhost:${port}/api`);
    console.log(`Auth routes: http://localhost:${port}/auth/*`);
});