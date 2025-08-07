import express from 'express';
import { isAuth, login, logout, register } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';

// 1. Create a router instance
const userRouter = express.Router();

// 2. Define POST route for user registration
userRouter.post('/register', register);
userRouter.post('/login',login)
userRouter.get('/is-auth', isAuth,authUser)// 3. Export the router
userRouter.get('/logout',logout,authUser);
export default userRouter;