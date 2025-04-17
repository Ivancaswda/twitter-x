import {create} from 'zustand'
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios.js";

export const usePostStore = create((set, get) => ({
    isLoading: false,
    newPost: null,
    isDeleting: false,
    isCommenting: false,
    isLiking: false,
    likedPosts: [],
    subPosts: [],
    posts: [],
    createPost: async (formData) => {
        try {
            set({isLoading:true})

            const response = await axiosInstance.post('/post/create', formData, {
                headers: {"Content-Type": "application/json"}
            })

            if (response.data.success) {
                toast.success('Вы успешно создали пост')
                set({ newPost: response.data.newPost })
                console.log(response.data.newPost)

            } else {
                toast.error(response.data.message)
            }



        } catch (error) {
            toast.error(error.message)
        } finally {
            set({isLoading:false})
        }
    },
    getPosts: async () => {
        try {
            set({posts: null})
            set({isLoading: true})
            const response = await axiosInstance.get('/post/posts')
            if (response.data.success) {
                set({posts: response.data.posts})
            }
        } catch (error) {
            toast.error(error.message)
        }  finally {
            set({isLoading:false})
        }
    },
    deletePost: async (id) => {
        try {
            set({isDeleting: true})
            const response= await axiosInstance.delete(`/post/remove/${id}`)
            if (response.data.success) {
                toast.success('Вы успешно удалили пост!')

            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            set({isDeleting: false})
        }
    },
    likePost: async (id) => {
        try {
            set({isLiking: true})
            console.log(id)
            const {data} = await axiosInstance.post(`/post/like/${id}`)
            if (data.success) {
                toast.success('Вы успешно лайкнули пост')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        } finally {
            set({isLiking: false})
        }
    },
    commentPost: async (id, content) => {
        try {
            set({isCommenting: true})

            const response = await axiosInstance.post(`/post/comment/${id}`, {content})

            if (response.data.success) {
                toast.success('Вы оставили комментарий!')
            } else {
                toast.error(response.data.message)
            }


        } catch (error) {
            toast.error(error.message)
        } finally {
            set({isCommenting:false})
        }
    },
    getLikedPosts: async (id) => {
        try {
            set({posts: null})
            const response = await axiosInstance.get(`/post/liked-posts/${id}`)
            if (response.data.success) {
                set({likedPosts: response.data.likedPosts})
            }
        } catch (error) {
            toast.error(error.message)
        }
    },
    getSubscribedPosts: async () => {
        try {
            set({posts: null})

            const {data} = await axiosInstance.get('/post/subscribing')

            if (data.success) {
                toast.success(data.message)
                set({ subPosts: data.subscribedPosts})
            } else {
                toast.error(data.message)
            }
        } catch (error) {



            toast.error(error.message)
        }
    }

}))