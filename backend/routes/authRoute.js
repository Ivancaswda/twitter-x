import express from "express";
import {getAuthUser, login, logout, signup} from "../controllers/authController.js";
import {protectRoute} from "../middlewares/authMiddleware.js";

const authRouter = express.Router()

authRouter.post('/signup', signup)
authRouter.post('/signin', login)
authRouter.post('/logout', logout)
authRouter.get('/get-user', protectRoute, getAuthUser)

export default authRouter