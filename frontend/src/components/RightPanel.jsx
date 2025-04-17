import React, {useEffect, useState} from 'react'
import {useAuthStore} from "../stores/useAuthStore.js";
import {LoaderIcon} from "react-hot-toast";
import RightPanelSkeleton from "./RightPanelSkeleton.jsx";
import {Link} from "react-router-dom";

const RightPanel = () => {


    const {isPending, getSuggestedUser, suggestedUsers, subscribeUnsub} = useAuthStore()
    useEffect(() => {
        getSuggestedUser()
        console.log(suggestedUsers)
    }, [])
    console.log(suggestedUsers)
    return (
        <div className='hidden lg:block my-4 mx-2'>
            <div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
                <p className='font-bold text-white'>На кого подписаться</p>
                <div className='flex flex-col gap-4'>
                    {/* item */}
                    {isPending && (
                        <>
                            <RightPanelSkeleton/>
                            <RightPanelSkeleton/>
                            <RightPanelSkeleton/>
                            <RightPanelSkeleton/>
                        </>
                    )}
                    {!isPending &&
                        suggestedUsers?.map((user) => (
                            <Link
                                to={`/profile/${user.username}`}
                                className='flex items-center justify-between gap-4'
                                key={user._id}
                            >
                                <div className='flex gap-2 items-center'>
                                    <div className='avatar'>
                                        <div className='w-8 rounded-full'>


                                            {user.profilePic ?
                                                <img src={user.profilePic}/> : <div className='w-[30px] text-center h-[30px] bg-gray-700 rounded-full
                                                         text-white flex items-center justify-center'>
                                                    <div
                                                        className='text-center flex items-center justify-center'>{user.fullName.charAt(0).toUpperCase()}</div>
                                                </div>}
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate text-white w-28'>
											{user.fullName}
										</span>
                                        <span className='text-sm text-slate-500'>@{user.userName}</span>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
                                        onClick={ async (e) => {
                                            e.preventDefault();
                                            await subscribeUnsub(user._id)
                                            await getSuggestedUser()
                                        }}
                                    >
                                        {isPending ? <LoaderIcon size='sm' animate='spin'/> : "Follow"}
                                    </button>
                                </div>
                            </Link>
                        ))}
                </div>
            </div>
        </div>
    )
}
export default RightPanel
