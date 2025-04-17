import React, {useEffect, useRef, useState} from 'react'
import {useAuthStore} from "../stores/useAuthStore.js";
import {FaArrowLeft, FaLink} from "react-icons/fa";
import {Link, useParams} from "react-router-dom";
import {formattedMemberSince} from "../utils/formatDate.js";
import toast, {LoaderIcon} from "react-hot-toast";
import {MdEdit} from "react-icons/md";
import {IoCalendarOutline} from "react-icons/io5";
import axiosInstance from "../lib/axios.js";
import EditProfileModal from "./EditProfileModal.jsx";
import Posts from "../components/Posts.jsx";
import {usePostStore} from "../stores/usePostStore.js";

const ProfilePage = () => {
    const [amISubscribing, setAmISubscribing] = useState(null)
    const [feedType, setFeedType] = useState('Посты')
    const [isSubscribed, setIsSubscribed] = useState('Подписаться')
    const [coverImg, setCoverImg] = useState('')
    const [profilePic, setProfilePic] = useState('')
    const profilePicRef = useRef(null)
    const coverImgRef = useRef(null)
    const {userName} = useParams()
    const [user, setUser] = useState(null)
    const {getSuggestedUser} = useAuthStore()
    const {getLikedPosts, getPosts} = usePostStore()
    const { isLoading, authUser, subscribeUnsub, updateProfile, isUpdatingProfile, } = useAuthStore()
    const getProfile =  async () => {
        try {
            if (!userName) return;
            const response = await axiosInstance.get(`/user/profile/${userName}`)
            if (response.data.success) {
                setUser(response.data.user)

            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    useEffect(() => {

        getProfile()
    }, [authUser, userName])

    useEffect( () => {
        if (authUser && user) {


            if (authUser.subscribing.includes(user._id)) {
                setIsSubscribed('Отписаться')
            } else {
                setIsSubscribed('Подписаться')
            }
        }

        getProfile()




    }, [authUser, user, userName])



    if (!user) {
        return <div className='w-full flex items-center justify-center flex-col'>
            <LoaderIcon className='animate-spin text-white size-[100px]'/>
        </div>
    }


    const isMyProfile = authUser._id === user._id
    const memberSinceDate = formattedMemberSince(user?.createdAt)


    const handleImgChange = (event, state) => {
        const file = event.target.files[0]

        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                state === 'coverImg' && setCoverImg(reader.result)
                state === 'profilePic' && setProfilePic(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }


    return (
        <>
            <div className='flex-[4_4_0]  border-r border-gray-700 min-h-screen '>
                {/* HEADER */}
                {!isLoading && !user && <p className='text-center text-lg mt-4'>User not found</p>}
                {(isLoading) && <ProfileHeaderSkeleton />}
                {!isLoading  && !user && <p className='text-center text-lg mt-4'>User not found</p>}
                <div className='flex flex-col'>
                    {!isLoading  && user && (
                        <>
                            <div className='flex gap-10 px-4 py-2 items-center'>
                                <Link to='/'>
                                    <FaArrowLeft className='w-4 h-4' />
                                </Link>
                                <div className='flex flex-col'>
                                    <p className='font-bold text-lg'>{user?.fullName}</p>
                                    {/* <span className='text-sm text-slate-500'>{POSTS?.length} posts</span> */}
                                </div>
                            </div>

                            <div className='relative group/cover'>
                                <img
                                    src={coverImg || user?.coverImg || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYQIqzv3klUwYdw6gGu46ZGaLUndElkWqDwA&s"}
                                    className='h-52 w-full object-cover'
                                    alt='cover image'
                                />
                                {isMyProfile && (
                                    <div
                                        className='absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200'
                                        onClick={() => coverImgRef.current.click()}
                                    >
                                        <MdEdit className='w-5 h-5 text-white' />
                                    </div>
                                )}

                                <input
                                    type='file'
                                    hidden
                                    accept='image/*'
                                    ref={coverImgRef}
                                    onChange={(e) => handleImgChange(e, "coverImg")}
                                />
                                <input
                                    type='file'
                                    hidden
                                    accept='image/*'
                                    ref={profilePicRef}
                                    onChange={(e) => handleImgChange(e, "profilePic")}
                                />
                                {/* USER AVATAR */}
                                <div className='avatar absolute -bottom-16 left-4'>
                                    <div className='w-32 rounded-full relative group/avatar bg-white p-2'>
                                        <img src={profilePic || user?.profilePic || "https://cdn-icons-png.flaticon.com/512/1077/1077114.png"} />
                                        <div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
                                            {isMyProfile && (
                                                <MdEdit
                                                    className='w-4 h-4 text-white'
                                                    onClick={() => profilePicRef.current.click()}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-end px-4 mt-5'>
                                {isMyProfile && <EditProfileModal authUser={authUser} />}
                                {!isMyProfile && (
                                    <button
                                        className='btn btn-outline rounded-full btn-sm'
                                        onClick={ async (e) => {
                                            e.preventDefault()
                                            await subscribeUnsub(user?._id)
                                            await getSuggestedUser()
                                            await getProfile()


                                        }}
                                    >
                                        {isLoading && "Загрузка..."}
                                        {!isLoading && !isSubscribed && "Отписаться"}
                                        {!isLoading && isSubscribed && "Подписаться"}
                                    </button>
                                )}
                                {(coverImg || profilePic) && (
                                    <button
                                        className='btn btn-primary rounded-full btn-sm text-white px-4 ml-2'
                                        onClick={async () => {
                                            await updateProfile({ coverImg, profilePic });
                                            setProfilePic(null);
                                            setCoverImg(null);
                                        }}
                                    >
                                        {isUpdatingProfile ? "Обновляем..." : "Обновить"}
                                    </button>
                                )}
                            </div>

                            <div className='flex flex-col gap-4 mt-14 px-4'>
                                <div className='flex flex-col'>
                                    <span className='font-bold text-lg'>{user?.fullName}</span>
                                    <span className='text-sm text-slate-500'>@{user?.userName}</span>
                                    <span className='text-sm my-1'>{user?.description}</span>
                                </div>

                                <div className='flex gap-2 flex-wrap'>
                                    {user?.link && (
                                        <div className='flex gap-1 items-center '>
                                            <>
                                                <FaLink className='w-3 h-3 text-slate-500' />
                                                <a
                                                    href='https://youtube.com/@asaprogrammer_'
                                                    target='_blank'
                                                    rel='noreferrer'
                                                    className='text-sm text-blue-500 hover:underline'
                                                >
                                                    {/* Updated this after recording the video. I forgot to update this while recording, sorry, thx. */}
                                                    {user?.link}
                                                </a>
                                            </>
                                        </div>
                                    )}
                                    <div className='flex gap-2 items-center'>
                                        <IoCalendarOutline className='w-4 h-4 text-slate-500' />
                                        <span className='text-sm text-slate-500'>{memberSinceDate}</span>
                                    </div>
                                </div>
                                <div className='flex gap-2'>
                                    <div className='flex gap-1 items-center'>
                                        <span className='font-bold text-xs'>{user?.subscribing.length}</span>
                                        <span className='text-slate-500 text-xs'>Подписан</span>
                                    </div>
                                    <div className='flex gap-1 items-center'>
                                        <span className='font-bold text-xs'>{user?.subscribers.length}</span>
                                        <span className='text-slate-500 text-xs'>Подписчиков</span>
                                    </div>
                                </div>
                            </div>
                            <div className='flex w-full border-b border-gray-700 mt-4'>
                                <div
                                    className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer'
                                    onClick={() => {
                                        setFeedType("Посты")
                                        getPosts()
                                    }}
                                >
                                    Posts
                                    {feedType === "Посты" && (
                                        <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
                                    )}
                                </div>
                                <div
                                    className='flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer'
                                    onClick={() => {
                                        setFeedType("Понравившийся")
                                        getLikedPosts(user._id)

                                    }}
                                >
                                    Likes
                                    {feedType === "Понравившийся" && (
                                        <div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary' />
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    <Posts feedType={feedType} userName={userName} userId={user?._id} />
                </div>
            </div>
        </>
    )
}
export default ProfilePage
