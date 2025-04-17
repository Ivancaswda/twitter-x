import express from 'express'
import {protectRoute} from "../middlewares/authMiddleware.js";
import {getUserProfile, subUnSubUser} from "../controllers/userController.js";
import {deleteNotification, getNotification, removeNotifications} from "../controllers/notificationController.js";

const notifRouter = express.Router()

notifRouter.get("/", protectRoute, getNotification)

notifRouter.delete("/remove", protectRoute, removeNotifications)

 notifRouter.delete("/remove/:id", protectRoute, deleteNotification)

export default notifRouter