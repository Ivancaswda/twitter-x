import userModel from "../models/userModel.js";
import postModel from "../models/postModel.js";
import {v2 as cloudinary} from 'cloudinary'
import notificationModel from "../models/notificationModel.js";

const createPost = async (request,response) => {
    try {
        const {content} = request.body
        let {image} = request.body
        const authorId = request.user._id

        const author = await userModel.findById(authorId)

        if (!author) {
            return response.json({success:false, message: 'Пользователь не найден!'})
        }
        if (!content && !image) {
            return  response.json({success:false, message: 'Вы не можете отправить пустой пост!'})
        }
        if (image) {
            const uploadedResponse = await cloudinary.uploader.upload(image)
            image =  uploadedResponse.secure_url
        }

        const newPost = new postModel({
            author: authorId,
            content,
            image
        })

        await newPost.save()

        response.json({success:true, newPost})
    } catch (error) {
        response.json({success:false, message:error.message})
    }
}

const removePost = async (request, response) => {
    try {
        const post = await postModel.findById(request.params.id) // находим пост с помощью айди из url

        if (!post) {
            return response.json({success:false, message: 'Пост не найден!'})
        }
        if (post.author.toString() !== request.user._id.toString()) {
            return response.json({success:false, message: 'Удалить пост может только создатель!'})
        }

        if (post.image) { // deleting image
            const imageId = post.image.split("/").pop().split('.')[0]
            // removing old image
            await cloudinary.uploader.destroy(imageId)

        }

        await postModel.findByIdAndDelete(request.params.id)

        response.json({success:true, message: 'Пост удалён успешно!'})
    } catch (error) {
        response.json({success:false, message:error.message})
    }
}

const commentPost = async (request, response) =>{
   try {



    const {content} = request.body

    const postId = request.params.id

    const authorId = request.user._id

    if (!content) {
        return  response.json({success:false, message: 'Вы не можете отправлять пустые комментарии'})
    }

    const post = await postModel.findById(postId)

    if (!post) {
        return response.json({success:false, message: 'Не удалось найти пост'})
    }

    const newComment = { author:authorId, content}

    post.comments.push(newComment)

       // new notification
       const newNotification = new notificationModel({
           type: 'comment',
           from: authorId,
           to: post.author
       })

       await newNotification.save()


    await post.save()

    response.json({success:true , message: 'Комментарий успешно оставлен!'})
   } catch (error) {
       response.json({success:false, message:error.message})
   }
}

const likePost = async (request, response) => {
        try {
            const postId = request.params.id
            const userId = request.user._id


            const post = await postModel.findById(postId)

            if (!post) {
                return response.json({success:false, message: 'Пост не найден!'})
            }

            const isLiked = post.likes.includes(userId)
            if (isLiked) {
                // unliking post function
                    // вытаскиваем айди из лайкы массив
                await postModel.updateOne({_id: postId}, {$pull: {likes:userId}})

                await userModel.updateOne({_id: userId}, {$pull: {likedPosts: postId}})

                response.json({success:true, message: 'Вы убрали отметку нравится'})
            } else {
                // liking post function

                post.likes.push(userId)
                await userModel.updateOne({_id: userId}, {$push: {likedPosts: postId}})
                await post.save()



                // sending notification

                const newNotification = notificationModel({
                    type: 'like',
                    from: userId,
                    to: post.author
                })

                await newNotification.save()

            }

            response.json({success:true})


        } catch (error) {
            response.json({success:false, message:error.message})
        }
}

const getAllPosts = async (request, response) => {
    try {
        const posts = await postModel.find().sort({createdAt: -1}).populate({
            path: 'author',
            select: '-password'
        }).populate({
            path: 'comments.author',
            select: '-password'
        }) // getting new at the top
        // with posts we are getting information about its author except password and about comment`s author as well
        if (posts.length === 0) {
            return response.json({ success: true, posts: [] })
        }

        response.json({success:true,posts})

    } catch (error) {
        response.json({success:false, message: error.message})
    }
}

const getLikedPosts = async (request, response) => {
    try {
        const userId = request.params.id;

        const user = await userModel.findById(userId)

        const likedPosts = await postModel.find({_id: {$in: user.likedPosts}}).populate({
            path: 'author',
            select: '-password'
        }).populate({ // getting data of author of liked post and comments of it
            path: 'comments.author',
            select: '-password'
        })
        response.json({success:true, likedPosts})
    } catch (error) {
        response.json({success:false, message: error.message})
    }
}
const getSubscribedPosts = async (request, response) => {
    try {
        const userId = request.user._id
        const user = await userModel.findById(userId)

        if (!user) {
            return response.json({success:false, message: 'пользователь не найден'})
        }

        const following = user.subscribing

        const subscribedPosts = await postModel.find({author: {$in: following}}).sort({createdAt: -1}).populate({
            path: 'author',
            select: '-password'
        }).populate({
            path: 'comments.author',
            select: "-password"
        })


        response.json({success: true, subscribedPosts})


    } catch (error) {
        response.json({success:false, message: error.message})
    }
}

const getUserPosts = async (request, response) => {
    try {
        const {userName} = request.body
        const user = await userModel.findOne({userName})

        if (!user) {
            return response.json({success:false, message: 'пользователь е найден'})
        }

        // finding post of given user

        const posts = await postModel.find({author: user._id}).sort({createdAt: -1}).populate({
            path: 'author',
            select: '-password'
        }).populate({
            path: 'comments.author',
            select: '-password'
        })
        response.json({success:true, posts})

    } catch (error) {
        response.json({success:false, message: error.message})
    }
}




export {createPost, removePost, likePost, commentPost, getAllPosts, getLikedPosts, getSubscribedPosts, getUserPosts}