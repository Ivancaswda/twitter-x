import React, {useEffect} from 'react'
import {usePostStore} from "../stores/usePostStore.js";
import PostSkeleton from "./PostSkeleton.jsx";
import Post from "./Post.jsx";
import {useAuthStore} from "../stores/useAuthStore.js";

const Posts = ({feedType}) => {

    const {posts, getPosts, isLoading, getLikedPosts, likedPosts,subPosts, getSubscribedPosts } = usePostStore()

    const {authUser} = useAuthStore()





    useEffect(() => {
        if (feedType === 'Посты' || feedType === 'forYou') {
            getPosts()
        } else if (feedType === 'Понравившийся') {
            getLikedPosts(authUser._id)
        } else if (feedType === 'following') {
            getSubscribedPosts()
        }
    }, [feedType, authUser._id])




    return (
        <>
            {(isLoading ) && (
                <div className='flex flex-col justify-center'>
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                </div>
            )}
            {!isLoading  && posts?.length === 0 && likedPosts?.length === 0 && subPosts?.length === 0 && (
                <p className='text-center my-4'>Пока нету постов. Подпишись на кого-нибудь известного👻</p>
            )}

            {!isLoading  && (
                <div>
                    {feedType === 'Понравившийся' ? (likedPosts?.map((post) => (
                        <Post feedType={feedType} key={post._id} post={post} />
                    ))) : (posts?.map((post) => (
                        <Post feedType={feedType} key={post._id} post={post} />
                    )))}

                    { feedType === 'following' && (
                        subPosts?.map((post) => (
                            <Post feedType={feedType} key={post._id} post={post}/>
                    ))
                    )}
                </div>
            )}
        </>
    )
}
export default Posts
