import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    userName: {type:String, required:true, unique: true},
    fullName: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true, minLength: 6},
    subscribers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            default: []
        }
    ],
    subscribing: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            default: []
        }
    ],
    profilePic: {
        type:String,
        default: ''
    },
    coverImg: {
        type:String,
        default: ''
    },
    description: {
        type:String,
        default: ''
    },
    link: {
        type:String,
        default: ""
    },
    likedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'post',
            default: []
        }
    ]

}, {timestamps: true})

const userModel = mongoose.models.user || mongoose.model("user", userSchema)

export default userModel