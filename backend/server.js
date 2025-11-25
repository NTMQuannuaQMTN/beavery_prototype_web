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

// Routes
app.use('/auth', authRouter);

// Health check
app.get('/api', (req, res) => {
    res.status(200).json({ message: 'Hello from Beavery backend!' });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});