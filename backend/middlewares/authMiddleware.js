import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";
export const generateWebToken = (userId, response) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '3d'})

    response.cookie('jwt-twitter', token, {
        maxAge: 15*24*60*60*1000,
        httpOnly:true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development'
    })
}
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies['jwt-twitter']

        if (!token) {
            return res.json({success:false, message:'Вы не авторизованы!'})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return res.json({success:false, message: "Не правильный токен"})
        }

        const user = await userModel.findById(decoded.userId).select("-password")

        if (!user) {
            return res.json({success:false , message: 'Вы не авторизировны!'})
        }

        req.user= user
        next()


    } catch (error) {
        res.json({success:false, message: error.message})
    }
}