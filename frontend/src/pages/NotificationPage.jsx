import React, {useEffect, useState} from 'react'
import {IoSettingsOutline} from "react-icons/io5";
import toast, {LoaderIcon} from "react-hot-toast";
import axiosInstance from "../lib/axios.js";
import {Link} from "react-router-dom";
import {FaHeart, FaUser} from "react-icons/fa";
import {SiUber} from "react-icons/si";

export const NotificationPage = () => {


    const [notifications, setNotifications] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const getNotifications =  async () => {
        try {
            setIsLoading(true)

            const response = await axiosInstance.get('/notification/')
            if (response.data.success) {
                setNotifications(response.data.notifications)
                toast.success('Уведомления получены!')
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getNotifications()
    }, [])
    console.log(notifications)

    const deleteNotifications = async () => {
        try {
            setIsLoading(true)

            const response= await axiosInstance.delete('/notification/remove')

            if (response.data.success) {
                toast.success('Все уведомления удалены!')
                await getNotifications()
            }

        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }

    }

    if (notifications.length === 0) {
        return <div className='w-full flex items-center justify-start mt-20 gap-4 flex-col'>
            <svg width='50' height='50' xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 448 512">
                <path fill='white'
                    d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm297.1 84L257.3 234.6 379.4 396H283.8L209 298.1 123.3 396H75.8l111-126.9L69.7 116h98l67.7 89.5L313.6 116h47.5zM323.3 367.6L153.4 142.9H125.1L296.9 367.6h26.3z"/>
            </svg>
            <b>У вас пока нет уведомлений!</b>
        </div>
    }

    return (
        <>
            <div className='flex-[4_4_0] border-l border-r border-gray-700 text-black min-h-screen'>
                <div className='flex justify-between items-center  p-4 border-b border-gray-700'>
                    <p className='font-bold'>Notifications</p>
                    <div className='dropdown text-white '>
                        <div tabIndex={0} role='button' className='m-1'>
                            <IoSettingsOutline className='w-4'/>
                        </div>
                        <ul
                            tabIndex={0}
                            className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
                        >
                            <li className='text-black'>
                                <a onClick={deleteNotifications}>Удалить все уведомления</a>
                            </li>
                        </ul>
                    </div>
                </div>
                {isLoading && (
                    <div className='flex justify-center h-full items-center'>
                        <LoaderIcon size='lg' />
                    </div>
                )}
                {notifications?.length === 0 && <div className='text-center p-4 font-bold'>Нет уведомленией 🤔</div>}
                {notifications?.map((notification) => (
                    <div className='border-b border-gray-700 text-white' key={notification._id}>
                        <div className='flex gap-2 p-4'>
                            {notification.type === "subscribe" && <FaUser className='w-7 h-7 text-white' />}
                            {notification.type === "like" && <FaHeart className='w-7 h-7 text-red-500' />}
                            <Link className='flex items-center gap-2' to={`/profile/${notification.from.userName}`}>
                                <div className='avatar'>
                                    <div className='w-8 rounded-full'>

                                        {notification.from.profilePic ?
                                            <img src={notification.from.profilePic }/> :
                                            <div className='w-[30px] text-center h-[30px] bg-gray-700 rounded-full
                                                         text-white flex items-center justify-center'>
                                                <div
                                                    className='text-center flex items-center justify-center'>{notification.from.userName.charAt(0).toUpperCase()}</div>
                                            </div>}

                                    </div>
                                </div>
                                <div className='flex gap-1'>
                                    <span className='font-bold'>@{notification.from.userName}</span>{" "}
                                    {notification.type === "subscribe" ? "Подписался на тебя" : "Понравился ваш пост"}
                                </div>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
