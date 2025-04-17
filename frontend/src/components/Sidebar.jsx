import React from 'react'
import {Link} from "react-router-dom";
import {useAuthStore} from "../stores/useAuthStore.js";
import {BiLogOut} from "react-icons/bi";
import {MdHomeFilled} from "react-icons/md";
import {IoNotifications} from "react-icons/io5";
import {FaUser} from "react-icons/fa";

const Sidebar = () => {

    const data ={
        fullName: ""
    }
    const {authUser, logout, getAuthUser} = useAuthStore()

    return (
        <div className='md:flex-[2_2_0] w-18 max-w-52'>
            <div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full'>
                <Link to='/' className='flex justify-center md:justify-start'>

                    {/*  <XSvg className='px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900'/> */}
                    <svg className='lg:w-1/6 fill-white' xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 512 512">
                        <path
                            d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/>
                    </svg>
                </Link>
                <ul className='flex flex-col gap-3 mt-4'>
                    <li className='flex justify-center md:justify-start'>
                        <Link
                            to='/'
                            className='flex gap-3 items-center hover:text-white hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
                        >
                            <MdHomeFilled className='w-8 h-8'/>
                            <span className='text-lg hidden md:block'>Home</span>
                        </Link>
                    </li>
                    <li className='flex justify-center md:justify-start'>
                        <Link
                            to='/notifications'
                            className='flex gap-3 items-center hover:text-white hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
                        >
                            <IoNotifications className='w-6 h-6'/>
                            <span className='text-lg hidden md:block'>Notifications</span>
                        </Link>
                    </li>

                    <li className='flex justify-center md:justify-start'>
                        <Link
                            to={`/profile/${authUser?.userName}`}
                            className='flex gap-3 items-center hover:text-white hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
                        >
                            <FaUser className='w-6 h-6'/>
                            <span className='text-lg hidden md:block'>Profile</span>
                        </Link>
                    </li>
                </ul>
                {authUser && (
                    <Link
                        to={`/profile/${authUser.userName}`}
                        className='mt-auto group mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full'
                    >
                        <div className='avatar hidden md:inline-flex'>
                            <div className='w-8 rounded-full'>


                                {authUser.profilePic ? <img src={authUser?.profilePic || "/avatar-placeholder.png"}/> :
                                    <div className='w-[30px] text-center h-[30px] bg-gray-700 rounded-full
                                                         text-white flex items-center justify-center'>
                                        <div
                                            className='text-center flex items-center justify-center'>{authUser.fullName.charAt(0).toUpperCase()}</div>
                                    </div>}
                            </div>
                        </div>
                        <div className='flex justify-between flex-1 '>
                            <div className='hidden md:block'>
                                <p className='text-white  font-bold text-sm w-20 truncate'>{authUser?.fullName}</p>
                                <p className=' text-slate-500  text-sm'>@{authUser?.userName}</p>
                            </div>
                            <BiLogOut
                                className='w-5 h-5 group-hover:text-white cursor-pointer'
                                onClick={async (e) => {
                                    e.preventDefault();
                                    await logout();
                                    await getAuthUser()

                                }}
                            />
                        </div>
                    </Link>
                )}
            </div>
        </div>
    )
}
export default Sidebar
