import React, {useState} from 'react'
import {useAuthStore} from "../stores/useAuthStore.js";
import {Link} from "react-router-dom";

const SignupPage = () => {

    const [formData, setFormData] = useState({
        email: '',
        userName: "",
        fullName: "",
        password: ""
    })
    const {isPending, authUser, signup} = useAuthStore()

    const handleSubmit = async (event) => {
        event.preventDefault()
        await signup(formData)

    }

    const handleInputChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value})
    }





    return (
        <div className='max-w-screen-xl mx-auto flex h-screen px-10'>
            <div className='flex-1 hidden lg:flex items-center  justify-center'>

                {/* <XSvg className='lg:w-2/3 fill-white'/> */}
                <svg className='lg:w-3/4 fill-white' xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 512 512">
                    <path
                        d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/>
                </svg>
            </div>
            <div className='flex-1 flex flex-col justify-center items-center'>
                <form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>

                    {/* <XSvg className='w-24 lg:hidden fill-white'/> */}
                    <svg className='w-24 lg:hidden fill-white' xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 512 512">
                        <path
                            d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/>
                    </svg>
                    <h1 className='text-4xl font-extrabold text-white'>Присоединись к нам!</h1>
                    <label className='input input-bordered rounded flex items-center gap-2'>

                        <input
                            type='email'
                            className='grow text-black'
                            placeholder='Email'
                            name='email'
                            onChange={handleInputChange}
                            value={formData.email}
                        />
                    </label>
                    <div className='flex gap-4 flex-wrap'>
                        <label className='input input-bordered rounded flex items-center gap-2 flex-1'>

                            <input
                                type='text'
                                className='grow text-black'
                                placeholder='Username'
                                name='userName'
                                onChange={handleInputChange}
                                value={formData.userName}
                            />
                        </label>
                        <label className='input input-bordered rounded flex items-center gap-2 flex-1'>

                            <input
                                type='text'
                                className='grow text-black'
                                placeholder='Full Name'
                                name='fullName'
                                onChange={handleInputChange}
                                value={formData.fullName}
                            />
                        </label>
                    </div>
                    <label className='input input-bordered rounded flex items-center gap-2'>

                        <input
                            type='password'
                            className='grow text-black'
                            placeholder='Password'
                            name='password'
                            onChange={handleInputChange}
                            value={formData.password}
                        />
                    </label>
                    <button type='submit' className='btn rounded-full btn-primary text-white'>
                        {isPending ? "Загрузка" : "Зарегистрироваться"}
                    </button>

                </form>
                <div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
                    <p className='text-white text-md'>Уже имеете аккаунт?</p>
                    <Link to='/login'>
                        <button className='btn rounded-full btn-primary text-white btn-outline w-full'>Войти</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
export default SignupPage
