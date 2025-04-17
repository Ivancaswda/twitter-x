import React, {useEffect, useState} from 'react'
import {useAuthStore} from "../stores/useAuthStore.js";


const EditProfileModal = () => {

    const [formData, setFormData] = useState({
        fullName: '',
        userName: '',
        email: '',
        description: '',
        link: '',
        newPassword: '',
        currentPassword: ''
    })

    const {updateProfile, isUpdatingProfile, authUser} = useAuthStore()

    const handleInputChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value})
    }

    useEffect(() => {
        if (authUser) {
            setFormData({
                fullName: authUser.fullName,
                userName: authUser.userName,
                email: authUser.email,
                description:authUser.description,
                link: authUser.link,
                newPassword: '',
                currentPassword: ''
            })
        }
    }, [authUser])

    return (
        <>
            <button
                className='btn btn-outline rounded-full btn-sm'
                onClick={() => document.getElementById("edit_profile_modal").showModal()}
            >
                Изменить профиль
            </button>
            <dialog id='edit_profile_modal' className='modal text-black'>
                <div className='modal-box border rounded-md border-gray-700 shadow-md'>
                    <h3 className='font-bold text-lg my-3'>Обновить профиль</h3>
                    <form
                        className='flex flex-col gap-4 text-black'
                        onSubmit={ async (e) => {
                            e.preventDefault();
                            await   updateProfile(formData);
                        }}
                    >
                        <div className='flex text-black flex-wrap gap-2'>
                            <input
                                type='text'
                                placeholder='Full Name'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.fullName}
                                name='fullName'
                                onChange={handleInputChange}
                            />
                            <input
                                type='text'
                                placeholder='Username'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.userName}
                                name='userName'
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            <input
                                type='email'
                                placeholder='Email'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.email}
                                name='email'
                                onChange={handleInputChange}
                            />
                            <textarea
                                placeholder='Описание'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.description}
                                name='description'
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            <input
                                type='password'
                                placeholder='Current Password'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.currentPassword}
                                name='currentPassword'
                                onChange={handleInputChange}
                            />
                            <input
                                type='password'
                                placeholder='New Password'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.newPassword}
                                name='newPassword'
                                onChange={handleInputChange}
                            />
                        </div>
                        <input
                            type='text'
                            placeholder='Link'
                            className='flex-1 input border border-gray-700 rounded p-2 input-md'
                            value={formData.link}
                            name='link'
                            onChange={handleInputChange}
                        />
                        <button className='btn btn-primary rounded-full btn-sm text-white'>
                            {isUpdatingProfile ? "Обновляем" : "Обновить"}
                        </button>
                    </form>
                </div>
                <form method='dialog' className='modal-backdrop'>
                    <button className='outline-none'>Закрыть</button>
                </form>
            </dialog>
        </>
    )
}
export default EditProfileModal
