import {create} from 'zustand'
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios.js";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isPending: false,
    user: null,
    suggestedUsers: [],
    isUpdatingProfile: false,
    isLoading: false,
    signup: async (formData) => {
        try {
            set({isPending: true})
            console.log(formData)
            const response = await axiosInstance.post("/auth/signup", formData)

            if (response.data.success) {
                toast.success('Вы успешно зарегистрированы!')
                console.log(response.data.user)
                set({authUser: response.data.user})
            } else {
                toast.error(response.data.message)
            }


        } catch (error) {

            toast.error(error.message)
        } finally {
            set({isPending: false})
        }
    },
    login: async (formData) => {
        try {
            const res = await axiosInstance('/auth/signin', formData)

            if (res.data.success) {
                toast.success('Вы успешно вошли!')
                set({authUser: res.data.user})
            }

        } catch (error) {
            toast.error(error.message)
        }
    },
    logout: async () => {
        try {

            const response = await axiosInstance.post('/auth/logout')

            if (response.data.success) {
                toast.success('Вы успешно вышли')
                set({authUser: null})
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    },
    getAuthUser: async () => {
        try {
            const response = await axiosInstance.get('/auth/get-user')

            if (response.data.success) {
                set({authUser: response.data.user})
            }


        } catch (error) {
            toast.error(error.message)
        }
    },
    getSuggestedUser: async () => {
        try {
            set({isPending: true})
            const response = await axiosInstance.get('/user/suggestions')

            if (response.data.success){
                set({suggestedUsers:response.data.suggestions})
                console.log(response.data.suggestions)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            set({isPending:false})
        }
    },
    subscribeUnsub: async (id) => {
        try {
            const response = await axiosInstance.post(`/user/subscribe/${id}`)

            if (response.data.success) {
                toast.success(response.data.message)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    },
    getProfile: async () => {

    },
    updateProfile: async (formData) => {
        try {
            set({isUpdatingProfile: true})

            const response = await axiosInstance.post('/user/update-profile', formData)

            if (response.data.success) {
                set({authUser: response.data.user})
                toast.success('Вы успешно обновили профиль')
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        } finally {
            set({isUpdatingProfile: false})
        }
    }

}))