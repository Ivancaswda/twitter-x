import React, {useState} from 'react'
import {useAuthStore} from "../stores/useAuthStore.js";
import {formatDate} from "../utils/formatDate.js";
import {usePostStore} from "../stores/usePostStore.js";
import {FaRegBookmark, FaRegComment, FaRegHeart, FaTrash} from "react-icons/fa";
import {Link} from "react-router-dom";
import {LoaderIcon} from "react-hot-toast";
import {BiRepost} from "react-icons/bi";
import {BsSend} from "react-icons/bs";
import {FiSend} from "react-icons/fi";

const Post = ({post, feedType}) => {



    const [comment, setComment] = useState('')

    const {authUser, } = useAuthStore()

    const {isDeleting, isCommenting, isLiking, commentPost, deletePost, likePost, getPosts, getLikedPosts} = usePostStore()

    const postOwner = post.author

    const isMyPost = authUser._id === post.author._id;
    const isLiked = post.likes.includes(authUser._id);

    const formattedDate = formatDate(post.createdAt)

    const handleDeletePost = async () => {
        await deletePost(post._id)
        await getPosts()

    }
    const handlePostComment = async (event) => {
        event.preventDefault()
        await commentPost(post._id, comment)
        await getPosts()

        setComment('')
    }
    const handleLikePost = async () => {
        await likePost(post._id)



         await   getPosts()


    }

    return (
        <>
            <div className='flex gap-2 items-start p-4 border-b border-gray-700'>
                <div className='avatar'>
                    <Link to={`/profile/${postOwner.userName}`} className='w-8 rounded-full overflow-hidden'>
                        {postOwner.profilePic ? <img src={postOwner.profilePic || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZmADCanENXbPEIU8BSSP8tofT9ydhrTCBaw&s"}/> : (
                            <div className='bg-gray-700 text-center flex items-center justify-center text-white w-[30px] h-[30px] rounded-full  '>
                                <div>
                                    {postOwner.fullName[0].toUpperCase()}
                                </div>
                            </div>
                        )}
                    </Link>
                </div>
                <div className='flex flex-col flex-1'>
                    <div className='flex gap-2 items-center'>
                        <Link to={`/profile/${postOwner.userName}`} className='font-bold'>
                            {postOwner.fullName}
                        </Link>
                        <span className='text-gray-700 flex gap-1 text-sm'>
							<Link to={`/profile/${postOwner.userName}`}>@{postOwner.userName}</Link>
							<span>·</span>
							<span>{formattedDate}</span>
						</span>
                        {isMyPost && (
                            <span className='flex justify-end flex-1'>
								{!isDeleting && (
                                    <FaTrash className='cursor-pointer hover:text-red-500' onClick={handleDeletePost} />
                                )}

                                {isDeleting && <LoaderIcon size='sm' />}
							</span>
                        )}
                    </div>
                    <div className='flex flex-col gap-3 overflow-hidden'>
                        <span>{post.content}</span>
                        {post.image && (
                            <img
                                src={post.image}
                                className='h-80 object-contain rounded-lg border border-gray-700'
                                alt=''
                            />
                        )}
                    </div>
                    <div className='flex justify-between mt-3'>
                        <div className='flex gap-4 items-center w-2/3 justify-between'>
                            <div
                                className='flex gap-1 items-center cursor-pointer group'
                                onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
                            >
                                <FaRegComment className='w-4 h-4  text-slate-500 group-hover:text-sky-400' />
                                <span className='text-sm text-slate-500 group-hover:text-sky-400'>
									{post.comments.length}
								</span>
                            </div>
                            {/* We're using Modal Component from DaisyUI */}
                            <dialog id={`comments_modal${post._id}`} className='modal border-none outline-none'>
                                <div className='modal-box rounded border border-gray-600'>
                                    <h3 className='font-bold text-lg mb-4'>КОММЕНТАРИИ</h3>
                                    <div className='flex flex-col gap-3 max-h-60 overflow-auto'>
                                        {post.comments.length === 0 && (
                                            <p className='text-sm text-slate-500'>
                                                Пока нету комментариев 🤔 Будь первым 😉
                                            </p>
                                        )}
                                        {post.comments.map((comment) => (
                                            <div key={comment._id} className='flex gap-2 items-start'>
                                                <div className='avatar'>
                                                    <div className='w-8 rounded-full'>
                                                        {comment.author.profilePic ? <img
                                                            src={comment.author.profilePic || "/avatar-placeholder.png"}
                                                        /> : <div className='w-[30px] text-center h-[30px] bg-gray-700 rounded-full
                                                         text-white flex items-center justify-center'>
                                                            <div className='text-center flex items-center justify-center'>{comment.author.fullName.charAt(0).toUpperCase()}</div>
                                                        </div>}

                                                    </div>
                                                </div>
                                                <div className='flex flex-col'>
                                                <div className='flex items-center gap-1'>
                                                        <span className='font-bold'>{comment.author.fullName}</span>
                                                        <span className='text-gray-700 text-sm'>
															@{comment.author.userName}
														</span>
                                                    </div>
                                                    <div className='text-sm'>{comment.content}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <form
                                        className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2'
                                        onSubmit={handlePostComment}
                                    >
										<textarea
                                            className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800'
                                            placeholder='Добавил комментарий...'
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        />
                                        <button className='btn btn-primary rounded-full btn-sm text-white px-3'>
                                            {isCommenting ? <LoaderIcon size='md' /> : <FiSend size='18'/>}
                                        </button>
                                    </form>
                                </div>
                                <form method='dialog' className='modal-backdrop'>
                                    <button className='outline-none'>close</button>
                                </form>
                            </dialog>
                            <div className='flex gap-1 items-center group cursor-pointer'>
                                <BiRepost className='w-6 h-6  text-slate-500 group-hover:text-green-500' />
                                <span className='text-sm text-slate-500 group-hover:text-green-500'>0</span>
                            </div>
                            <div className='flex gap-1 items-center group cursor-pointer' onClick={handleLikePost}>
                                {isLiking && <LoaderIcon size='sm' />}
                                {!isLiked && !isLiking && (
                                    <FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
                                )}
                                {isLiked && !isLiking && (
                                    <FaRegHeart className='w-4 h-4 cursor-pointer text-pink-500 ' />
                                )}

                                <span
                                    className={`text-sm  group-hover:text-pink-500 ${
                                        isLiked ? "text-pink-500" : "text-slate-500"
                                    }`}
                                >
									{post.likes.length}
								</span>
                            </div>
                        </div>
                        <div className='flex w-1/3 justify-end gap-2 items-center'>
                            <FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer' />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Post
