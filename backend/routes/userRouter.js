import express from 'express';
import cors from 'cors';

const userRouter = express.Router();

// Example route to get all users
userRouter.get('/', (req, res) => {
    res.status(200).send('Get all users');
});

export default userRouter;