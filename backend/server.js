import express from 'express'
import dotenv from 'dotenv'
import connectDb from "./lib/mongodb.js";
import connectCloudinary from "./lib/cloudinary.js";
import cookieParser from 'cookie-parser'
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import postRouter from './routes/postRoute.js';
import notifRouter from "./routes/notificationRoute.js";
import cors from 'cors'
import path from "path";

const app = express()

const __dirname = path.resolve()
const PORT = process.env.PORT || 2005
// const __dirname = path.resolve()
dotenv.config()






connectCloudinary()


if (process.env.NODE_ENV !== 'production') {


    app.use(cors({
        origin: 'http://localhost:5175',
        credentials: true
    }))
}


app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(express.json({limit: '5mb'}))



app.use('/api/auth', authRouter)

app.use('/api/user', userRouter)

app.use('/api/post', postRouter)



app.use('/api/notification', notifRouter)









app.listen(PORT, () => {
    console.log(`сервер запущен на порте ${PORT}`)
    connectDb()
})
