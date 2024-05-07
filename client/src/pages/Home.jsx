import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CallToAction from './../components/CallToAction';
import PostCard from './../components/PostCard';

const Home = () => {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/post/getposts')
                const data = await response.json()
                setPosts(data.posts)
            } catch (error) {
                console.log(error)
            }
        }
        fetchPosts();
    }, [])


    return (
        <div>
            <div className="flex flex-col gap-6 px-3 p-28 max-w-6xl mx-auto">
                <h1 className='text-3xl font-bold lg:text-6xl'>
                    Welcome to my blog
                </h1>
                <p className='text-gray-500 text-xs sm:text-sm'>
                    Here you will find a variety of articles and tutorials on topis such as web development, data science, and machine learning.
                </p>
                <Link to='/search' className="text-xm sm:text-sm text-teal-500 fond-bold hover:underline">View all posts</Link>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-slate-700">
                <CallToAction />
            </div>
            <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
                {
                    posts && posts.length > 0 && (
                        <div className='flex flex-col gap-6'>
                            <h2 className='text-2xl fond-semibold text-center'>Recent Posts</h2>
                            <div className="flex flex-wrap gap-4">
                                {
                                    posts.map(post => (
                                        <PostCard key={post._id} post={post} />
                                    ))
                                }
                            </div>
                            <Link to='/search' className='text-lg text-teal-500 hover:underline text-center'>View all posts</Link>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Home