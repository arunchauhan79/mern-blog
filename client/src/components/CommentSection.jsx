import { Alert, Button, Textarea } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';

const CommentSection = ({ postId }) => {
    const navigate = useNavigate()
    const { currentUser } = useSelector(state => state.user);
    const [comment, setComment] = useState('')
    const [commentError, setCommentError] = useState('');
    const [comments, setComments] = useState([])
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (comment.length > 200) {
            return;
        }
        try {
            const res = await fetch('/api/comment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: comment,
                    postId: postId,
                    userId: currentUser._id
                })
            });
            const data = await res.json();
            if (res.ok) {
                setComment('')
                setCommentError('')
                setComments([data, ...comments])
            }
        } catch (error) {
            setCommentError(error.message);
        }
    }

    useEffect(() => {

        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/comment/getPostComments/${postId}`)
                if (res.ok) {
                    const data = await res.json();
                    setComments(data)
                }
            } catch (error) {
                setCommentError(error.message);
            }
        }
        fetchComments();
    }, []);

    const handleLike = async (commentId) => {
        try {
            if (!currentUser) {
                navigate('/sign-in');
                return;
            }
            const res = await fetch(`/api/comment/likeComment/${commentId}`, {
                method: 'PUT'
            })
            if (res.ok) {
                const data = await res.json();
                setComments(comments.map(comment =>
                    comment._id === commentId ? {
                        ...comment,
                        likes: data.likes,
                        numberOfLikes: data.likes.length
                    } : comment
                ))

            }
        } catch (error) {

        }
    }
    return (
        <div className='max-w-2xl mx-auto w-full p-3'>
            {currentUser ?
                (<div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
                    <p>Signed in as:</p>
                    <img src={currentUser?.profilePicture} className='w-5 h-5 object-cover rounded-full' alt="profile picture" />
                    <Link to={'/dashboard?tab=profile'} className='text-xs text-cyan-600 hover:underline'>
                        {`@${currentUser?.username}`}
                    </Link>

                </div>) :
                (<div className='text-sm text-teal-500 my-5 flex gap-1'>
                    You must be signed in to comment.
                    <Link to={'/sign-in'} className='text-blue-500 hover:underline'>
                        Sign in
                    </Link>
                </div>)}
            {
                currentUser && (
                    <form onSubmit={handleSubmit} className='border border-teal-500 p-3 rounded-md'>
                        <Textarea placeholder='Add a comment...'
                            rows={3}
                            maxLength={200}
                            onChange={e => setComment(e.target.value)}
                            value={comment}
                        />
                        <div className='flex items-center justify-between mt-5'>
                            <p className='text-gray-400 text-sm'>{200 - comment.length} characters remaining</p>
                            <Button outline={true} gradientDuoTone={'purpleToBlue'} type='submit'>Submit</Button>
                        </div>
                    </form>)
            }
            {
                commentError && (
                    <Alert color='failure' className='mt-5'>
                        {commentError}
                    </Alert>
                )
            }
            {
                comments.length === 0 ? (<p className='text-sm my-5'>
                    No comments yet.
                </p>) : (<div className='text-sm my-5 flex items-center gap-1'>
                    <p>comments</p>
                    <div className='border border-gray-400 py-1 px-2 rounder-sm'>
                        <p>{comments.length}</p>
                    </div>
                </div>)

            }

            {

                comments.map(comment => <Comment key={comment._id} comment={comment} onLike={handleLike} />)
            }
        </div>
    )
}

export default CommentSection