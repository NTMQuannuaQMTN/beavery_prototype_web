import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

app.get('/api', (req, res) => {
    res.status(200).send('Hello from Beavery backend!');
});