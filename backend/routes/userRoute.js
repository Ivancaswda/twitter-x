import express from 'express'
import {getSuggestions, getUserProfile, subUnSubUser, updateProfile} from "../controllers/userController.js";
import {protectRoute} from "../middlewares/authMiddleware.js";



const userRouter = express.Router()

userRouter.get('/profile/:userName', protectRoute, getUserProfile)

userRouter.get('/suggestions', protectRoute, getSuggestions)

userRouter.post('/subscribe/:id', protectRoute, subUnSubUser)

userRouter.post("/update-profile", protectRoute,updateProfile)



export default userRouter