import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    author: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    content: {type:String},
    image: {type:String},
    likes: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    comments: [
        {
            content: {
                type: String,
                required:true
            },
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
                required:true
            }
        }
    ]
}, {timestamps: true})

const postModel = mongoose.models.post || mongoose.model('post', postSchema)

export default postModel