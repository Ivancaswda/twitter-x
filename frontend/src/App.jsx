import React, {useEffect} from 'react'
import {Navigate, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import {Toaster} from "react-hot-toast";
import {useAuthStore} from "./stores/useAuthStore.js";
import RightPanel from "./components/RightPanel.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import {NotificationPage} from "./pages/NotificationPage.jsx";

const App = () => {

    const {authUser, getAuthUser, logout} = useAuthStore()

    useEffect( () => {
        getAuthUser()
        console.log(authUser)
    }, [getAuthUser])




    return (
        <div className='min-h-screen w-full bg-black'>
            <div className='flex max-w-6xl mx-auto bg-black text-white'>
                {authUser &&           <Sidebar/>}

                <Routes>
                    <Route path='/' element={authUser ? <HomePage/> : <Navigate to='/login'/>}/>
                    <Route path='/signup' element={authUser ? <Navigate to='/'/> : <SignupPage/>}/>
                    <Route path='/login' element={authUser ? <Navigate to='/'/> : <LoginPage/>}/>
                    <Route path='/profile/:userName' element={authUser ? <ProfilePage/> : <Navigate to='/login'/>}/>
                    <Route path={'/notifications'} element={authUser ? <NotificationPage/> : <Navigate to='/login'/>}/>
                </Routes>
                <Toaster/>
                {authUser &&           <RightPanel/>}
            </div>
        </div>
    )
}
export default App
