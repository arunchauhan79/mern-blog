import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { FaThumbsUp } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { Button, Textarea } from 'flowbite-react'

const Comment = ({ comment, onLike, onEdit }) => {
    const { currentUser } = useSelector(state => state.user)
    const [user, setUser] = useState(null);
    const [isCommentEdit, setIsCommentEdit] = useState(false);
    const [editedComment, setEditedComment] = useState(comment.content)
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`);
                const data = await res.json();
                if (res.ok) {
                    setUser(data)
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        fetchUser();
    }, [comment])
    const handleEdit = () => {
        setIsCommentEdit(true)
    }
    const saveEditedComment = async () => {
        try {
            const res = await fetch(`/api/comment/editComment/${comment._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: editedComment
                })
            })
            if (res.ok) {
                const data = await res.json()
                setIsCommentEdit(false)
                onEdit(comment, editedComment)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div className='flex p-3 border-b dark:border-gray-600 text-sm'>
            <div className='flex-shrink-0 mr-3 '>
                <img className='w-10 h-10 rounded-full bg-gray-200' src={user?.profilePicture} alt={user?.username} />
            </div>
            <div className='flex-1'>
                <div className='flex items-center mb-1'>
                    <span className='font-bold mr-1 text-xs truncate'>{user ? `@${user?.username}` : 'anonymous user'}</span>
                    <span className='text-sm text-gray-400'>{moment(comment.createdAt).fromNow()}</span>
                </div>
                {
                    isCommentEdit ? (<><Textarea rows={3}
                        maxLength={200} onChange={(e) => setEditedComment(e.target.value)} value={editedComment} ></Textarea>
                        <div className='flex items-center justify-end gap-2 pt-2'>
                            <Button gradientDuoTone={"purpleToBlue"} outline onClick={saveEditedComment}>Save</Button>
                            <button onClick={() => setIsCommentEdit(false)} type="button" className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2  dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">Cancel</button>
                        </div>
                    </>) : (<>
                            <p className='text-gray-500 pb-2'>{comment.content}</p>
                            <div className='flex gap-2 items-center pt-2 text-xs'>
                                <button type='button' className={`text-gray-400 hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'}`} onClick={() => onLike(comment._id)}>
                                    <FaThumbsUp className='text-sm' />
                                </button>
                                <p className='text-gray-500'>
                                    {
                                        comment.numberOfLikes > 0 && comment.numberOfLikes + ' ' + (comment.numberOfLikes === 1 ? 'like' : 'likes')
                                    }
                                </p>
                            {
                                (currentUser.isAdmin || comment.userId === currentUser._id) && <button type='button' className='text-gray-500 text-xs' onClick={handleEdit}>
                                    Edit
                                </button>
                            }
                        </div></>)
                }

            </div>
        </div>
    )
}

export default Comment