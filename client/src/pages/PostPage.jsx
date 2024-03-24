import { Button, Spinner } from 'flowbite-react';
import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import CallToAction from '../components/CallToAction';

const PostPage = () => {
    const { slug } = useParams();
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [post, setPost] = useState(null)
    useEffect(() => {

        const fetchPost = async () => {
            setLoading(true);

            try {
                const res = await fetch('/api/post/getPosts?slug=' + slug);
                const data = await res.json();
                if (!res.ok) {
                    setLoading(false);
                    setError(res.message)
                }
                else {
                    console.log(data.posts[0])
                    setLoading(false);
                    setPost(data.posts[0])
                }
            } catch (error) {
                setError(error.message)
            }
        }

        fetchPost();


    }, [slug])

    if (loading)
        return (
            <div className='flex justify-center items-center min-h-screen'>

                <Spinner size='xl' />
            </div>)

    return (
        <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
            <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{post && post.title}</h1>
            <Link to={`search?category=${post && post.category}`} className='self-center mt-5'>
                <Button color='gray' pill size='xs'>{post && post.category}</Button>
            </Link>
            <img src={post && post.image} alt={post && post.title} className='mt-10 p-3 max-h-[400px] w-full object-cover md:max-h-[600px]' />
            <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
                <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                <span className='italic'>{post && (post.content.length / 1000).toFixed(0)} mins read</span>
            </div>
            <div className='p-3 max-w-2xl mx-auto w-full post-content' dangerouslySetInnerHTML={{ __html: post && post.content }}></div>
            <div className="max-w-4xl mx-auto w-full">
                <CallToAction />
            </div>
        </main>
    )
}

export default PostPage
