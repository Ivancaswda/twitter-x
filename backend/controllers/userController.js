import userModel from "../models/userModel.js";
import notificationModel from "../models/notificationModel.js";
import bcrypt from "bcryptjs";
import {v2 as cloudinary} from 'cloudinary'


const getUserProfile = async (request, response) => {
    try {
        const {userName} = request.params

        const user = await userModel.findOne({userName}).select("-password")

        if (!user) {
            return response.json({success: false, message: 'пользователь не найден'})
        }
        response.json({success:true, user})
    } catch (error) {
        response.json({success: false, message:error.message})
    }
}
const subUnSubUser = async (request,response) => {
    try {
        const {id} = request.params // id of user we about to sub on
        const userToSub = await userModel.findById(id) // user we about to sub on

        const currentUser = await userModel.findById(request.user._id) // me

        if (id === request.user._id.toString()) {
            response.json({success:false, message: 'Нельзя подписаться на себя!'})
        }

        if (!userToSub || !currentUser) {
            return response.json({success:false, message: 'пользователь не найден'})
        }

        const isSubscribing = currentUser.subscribing.includes(id)

        if (isSubscribing) {
            // если уже подписаны то тогда делаем функцию отписывания


            // taking off user.id of my array of subscribing
            await userModel.findByIdAndUpdate(request.user._id, { $pull: {subscribing: id}})

            await userModel.findByIdAndUpdate(id, {$pull: {subscribers: request.user._id}})


        } else {
            // функция подписывание
            // pushing my id into subscribers array of the user
            await userModel.findByIdAndUpdate(id, { $push: {subscribers: request.user._id}})
            // pushing his id into my array of subscribing
            await userModel.findByIdAndUpdate(request.user._id, { $push: {subscribing: id}})

            //sending notification to we about to sub on user

            const newNotification = new notificationModel({
                type: 'subscribe',
                from: request.user._id,
                to: userToSub._id
            })
            await newNotification.save()

        }

        response.json({success:true})

    } catch (error) {
        response.json({success:false, message: error.message})
    }
}
const getSuggestions = async (request, response) => {
    try {
       const userId = request.user._id

        const userSubscribedByMe = await userModel.findById(userId).select('subscribing')


        if (!userSubscribedByMe) {
            return response.json({success: false, message: "Пользователь не найден"});
        }
        console.log(userSubscribedByMe)


        // first suggested getting unsubscribed users

        const users = await userModel.find({
            _id: {
                $nin: [...userSubscribedByMe.subscribing, userId]
            }
        }).limit(5).select('-password')
        console.log(users)
        // returning 10 users some already followed
        const subscribedIds = userSubscribedByMe.subscribing.map(id => id.toString());

        const suggestedUsers = users.filter((user) => {
            return !subscribedIds.includes(user._id.toString());
        });
         // we took only 5 users


        const suggestions = suggestedUsers.slice(0, 5)

        suggestions.forEach((sg) => {
            return sg.password = null // concealing // veiling of password
        })



        response.json({success:true, suggestions})

    } catch (error) {
        response.json({success:false, message: error.message})
    }
}


const updateProfile = async (request, response) => {
    try {
        const {fullName, email, userName, currentPassword, newPassword, description, link } = request.body

        let {profilePic, coverImg} = request.body

        const userId =request.user._id

        let user = await userModel.findById(userId)

        if (!user) {
            return response.json({success:false, message: 'Пользователь не найден!'})
        }

        if (!newPassword && currentPassword) {
            return  response.json({success:false, message: 'Для смены пароля предоставьте старый и новый пароль'})
        }

        if (currentPassword && newPassword) { // updating password
            const isMatch = await bcrypt.compare(currentPassword, user.password)
            // если введенный пароль неверный
            if (!isMatch) {
                return response.json({success:false, message: 'Неверный пароль!'})
            }

            if (newPassword.length <= 6) {
                return response.json({success:false, message: 'Пароль должен иметь более 6 символов'})
            }
            const salt = await bcrypt.genSalt(10)

            user.password = await bcrypt.hash(newPassword, salt)

        }

        if (profilePic) { //updating image
            // если img уже существует мы его удаляем
            if (user.profilePic) {
                await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]) // deleting old img from cloudinary
            }
           let uploadedResponse =  await cloudinary.uploader.upload(profilePic)
            profilePic = uploadedResponse.secure_url
        }

        if (coverImg) { // updating headline
                // если old img уже существует мы его удаляем from cloudinary storage
            if (user.coverImg) {
                await cloudinary.uploader.destroy(user.coverImg.split('/').pop().split(".")[0])
            }

            let uploadedResponse = await cloudinary.uploader.upload(coverImg)
            coverImg = uploadedResponse.secure_url
        }

        user.fullName = fullName || user.fullName

        user.email = email || user.email

        user.userName = userName || user.userName

        user.description = description || user.description

        user.link = link || user.link

        user.profilePic = profilePic || user.profilePic

        user.coverImg = coverImg || user.coverImg

        await user.save()

        response.json({success:true, user, message: 'Вы успешно обновили профиль'})
    } catch (error) {
        response.json({success:false, message:error.message})
    }
}

export {getUserProfile, subUnSubUser, getSuggestions, updateProfile}
