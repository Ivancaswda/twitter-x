import express from 'express'
import {protectRoute} from "../middlewares/authMiddleware.js";
import {
    commentPost,
    createPost,
    getAllPosts,
    getLikedPosts, getSubscribedPosts, getUserPosts,
    likePost,
    removePost
} from "../controllers/postController.js";


const postRouter = express.Router()

postRouter.post("/create", protectRoute, createPost)

postRouter.get('/subscribing', protectRoute, getSubscribedPosts)

postRouter.get('/user-post/:id' , protectRoute, getUserPosts)

postRouter.get('/posts', protectRoute, getAllPosts)

postRouter.get('/liked-posts/:id', protectRoute, getLikedPosts)

postRouter.delete('/remove/:id', protectRoute, removePost)

postRouter.post("/like/:id", protectRoute, likePost)

postRouter.post("/comment/:id", protectRoute, commentPost)

export default postRouter