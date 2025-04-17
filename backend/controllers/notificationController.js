import notificationModel from "../models/notificationModel.js";

export const getNotification = async (request,response) => {
    try {
        const userId = request.user._id
        const notifications = await notificationModel.find({to:userId}).populate({
            path: "from", // getting from-user value
            select: "userName profilePic"
        })
        // marking notification as read
        await notificationModel.updateMany({to:userId}, {read:true})

        response.json({success:true, notifications})
    } catch (error) {
        response.json({success:false, message: error.message})
    }
}

export const removeNotifications = async (request, response) => {
    try {
        const userId = request.user._id

        await notificationModel.deleteMany({to: userId})

        response.json({success:true,message: 'уведоление удалено!'})
    } catch (error) {
        response.json({success:false, message: error.message})
    }
}

export const deleteNotification = async (request, response) => {
    try {
        const notificationId = request.params.id;
        const userId = request.user._id;
        const notification = await notificationModel.findById(notificationId)

        if (!notification) {
            return response.json({success:false, message: 'Не удалось найти уведолмение'})
        }
        if (notification.to.String() !== userId.toString) {
            return response.json({success:false, message: 'Вы не можете удалить это уведомление'})
        }



        await notificationModel.findByIdAndDelete(notificationId)


        response.json({success:true, message: 'Вы успешно удалили уведомление'})

    } catch (error) {
        response.json({success:false, message:error.message})
    }
}