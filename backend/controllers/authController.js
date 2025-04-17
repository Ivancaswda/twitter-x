import userModel from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import {generateWebToken} from "../middlewares/authMiddleware.js";
import {response} from "express";
import jwt from "jsonwebtoken";
const signup = async (request, response) => {
    try {
        const {fullName, userName, email, password} = request.body

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailRegex.test(email)) {
            return response.json({success:false, message: 'Неправильный формат электронной почты!'})
        }
        const existingUser = await userModel.findOne({userName})
        if (existingUser) {
            return response.json({success:false, message: 'Пользователь уже существует!'})
        }

        if (password.length < 6) {
            return  response.json({success:false, message: 'Пароль должен иметь более 6 символов'})
        }

        const salt = await bcrypt.genSalt(8)

        const hashedPassword = await bcrypt.hash(password, salt)



        const user =  new userModel({
            email, fullName, userName, password:hashedPassword
        })



        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET,{expiresIn: '3d'}) // CREATING TOKEN

        response.cookie('jwt-twitter', token,  {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 3 * 24 * 60 * 60 * 1000,
            secure: false
        })
        await user.save()
        response.json({success:true, user, message:'Вы успешно зарегистированы!'})
    } catch (error) {
        response.json({success:false, message: error.message})
    }
}
const login = async (request, response) => {
    try {
        const { password} = request.body
        const user = await userModel.findOne({email})

        if (!user) {
            return response.json({success:false, message: 'Пользователя не существует'})
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password || "")
        if (!isPasswordCorrect) {
            return  response.json({success:false, message: 'Неправильный пароль'})
        }
        generateWebToken(user._id, response)

        response.json({success:true, user, message: 'Вы успешо вошли!'})

    } catch (error) {
        response.json({success:false, message:error.message})

    }
}

const logout = async (request,response) => {
    try {
        response.clearCookie("jwt-twitter")
        response.json({success:true, message: 'Вы успешно вышли'})
    } catch (error) {
        response.json({success:false, message:error.message})
    }
}
const getAuthUser = async (request, response) => {
    try {
        const user = await userModel.findById(request.user._id).select("-password")
        response.json({success:true, user})
    } catch (error) {
        response.json({success:false, message:error.message})
    }
}

export {signup, login,logout, getAuthUser}