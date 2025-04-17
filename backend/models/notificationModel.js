import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required:true
    },
    type: {type:String, required:true, enum: ['like', 'subscribe', 'comment']},
    read: {type:Boolean, default:false}

}, {timestamps: true})

const notificationModel = mongoose.models.notification || mongoose.model("notification", notificationSchema)

export default notificationModel