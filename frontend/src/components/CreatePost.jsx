import React, {useRef, useState} from 'react'
import {CiImageOn} from "react-icons/ci";
import {BsEmojiSmileFill} from "react-icons/bs";
import {useAuthStore} from "../stores/useAuthStore.js";
import {IoCloseSharp} from "react-icons/io5";
import {usePostStore} from "../stores/usePostStore.js";

const CreatePost = () => {

    const {isPending, authUser} = useAuthStore()
    const {createPost, posts, getPosts,} = usePostStore()
    const [content, setContent] = useState('')
    const [image, setImage] = useState('')
    const imgRef = useRef(null)
    const handleSubmit = async (e) => {
        e.preventDefault()
        await createPost({content, image})
        await getPosts()
        console.log(posts)
        setImage('')
        setContent('')
    }
    const handleImageChange = (e) => {
        const file = e.target.files[0]

        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                setImage(reader.result)
            }
            reader.readAsDataURL(file)

        }
    }

    return (
        <div className='flex p-4 items-start gap-4 border-b border-gray-700'>
            <div className='avatar'>
                <div className='w-8 rounded-full'>

                    {authUser.profilePic ? <img src={authUser.profilePic || "/avatar-placeholder.png"}/> :
                        <div className='w-[30px] text-center h-[30px] bg-gray-700 rounded-full
                                                         text-white flex items-center justify-center'>
                            <div
                                className='text-center flex items-center justify-center'>{authUser.fullName.charAt(0).toUpperCase()}</div>
                        </div>}

                </div>
            </div>
            <form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
				<textarea
                    className='textarea w-full p-0 text-lg bg-black text-white resize-none border-none focus:outline-none  border-gray-800'
                    placeholder='What is happening?!'
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                {image && (
                    <div className='relative w-72 mx-auto'>
                        <IoCloseSharp
                            className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
                            onClick={() => {
                                setImage(null);
                                imgRef.current.value = null;
                            }}
                        />
                        <img src={image} className='w-full mx-auto h-72 object-contain rounded'/>
                    </div>
                )}

                <div className='flex justify-between border-t py-2 border-t-gray-700'>
                    <div className='flex gap-1 items-center'>
                        <CiImageOn
                            className='fill-primary w-6 h-6 cursor-pointer'
                            onClick={() => imgRef.current.click()}
                        />
                        <BsEmojiSmileFill className='fill-primary w-5 h-5 cursor-pointer'/>
                    </div>
                    <input type='file' accept='image/*' hidden ref={imgRef} onChange={handleImageChange}/>
                    <button className='btn btn-primary rounded-full btn-sm text-white px-4'>
                        {isPending ? "Posting..." : "Post"}
                    </button>
                </div>

            </form>
        </div>
    )
}
export default CreatePost
