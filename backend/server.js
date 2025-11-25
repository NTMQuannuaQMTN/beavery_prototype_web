import express from "express";
import cors from "cors";
import authRouter from "./routes/authRouter.js";

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRouter);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

app.get('/api', (req, res) => {
    res.status(200).send('Hello from Beavery backend!');
});