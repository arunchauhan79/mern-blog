import { Button, Table, Modal, Avatar } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { FaCheck, FaTimes } from "react-icons/fa";

const DashComments = () => {
    const { currentUser } = useSelector(state => state.user);
    const [comments, setComments] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [commentId, setCommentId] = useState("")
    useEffect(() => {

        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/comment/getcomments`);
                const data = await res.json();
                if (res.ok) {
                    setComments(data.comments)
                    if (data.comments.length < 9) {
                        setShowMore(false)
                    }
                }
            }
            catch (error) {
                console.log(error.message)
            }
        }

        if (currentUser.isAdmin) {
            fetchComments()
        }

    }, [currentUser._id]);

    const handleShowMore = async () => {
        const startIndex = comments.length;
        try {
            const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setComments((prev) => [...prev, ...data.comments]);
                if (data.comments.length < 9) {
                    setShowMore(false)
                }
            }
        } catch (error) {

        }
    }
    const handleDeleteComment = async () => {
        setShowModal(false)
        try {
            const res = fetch(`/api/comment/deleteComment/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },

            })
            const data = await res.json();
            if (res.ok) {
                setComments(comments.filter(comment => comment._id !== userId));
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.isAdmin && comments.length > 0 ? (<>
                <Table hoverable className='shadow-md'>
                    <Table.Head>
                        <Table.HeadCell>Updated date</Table.HeadCell>
                        <Table.HeadCell>Comment content</Table.HeadCell>
                        <Table.HeadCell>No of likes</Table.HeadCell>
                        <Table.HeadCell>PostId</Table.HeadCell>
                        <Table.HeadCell>UserId</Table.HeadCell>
                        <Table.HeadCell>Delete</Table.HeadCell>

                    </Table.Head>
                    {
                        comments.map(comment => (
                            <Table.Body className='divide-y'>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>
                                        <span>
                                            {new Date(comment.updatedAt).toLocaleDateString()}
                                        </span>

                                    </Table.Cell>
                                    <Table.Cell>
                                        {comment.content}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span>{comment.numberOfLikes}</span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span>{comment.PostId}</span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span>
                                            {comment.userId}
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell >
                                        <span onClick={() => {
                                            setShowModal(true);
                                            setCommentId(comment._id);
                                        }} className='font-medium text-red-500 hover:underline cursor-pointer'>Delete</span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {/* <Link className='font-medium text-teal-500  hover:underline cursor-pointer' to={`/update-post/${post._id}`}>
                                            <span>Edit</span>
                                        </Link> */}

                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))
                    }
                </Table>
                {
                    showMore &&
                    <button className="w-full text-teal-500 self-center text-sm py-7" onClick={handleShowMore}>
                        Show more
                    </button>
                }
            </>) : (<div>
                <p>There is no comment yet</p>
            </div>)}
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                popup
                size={'md'}
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                    </div>
                    <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                        Are you sure you want to delete this comment?
                    </h3>
                    <div className="flex justify-center gap-6">
                        <Button color='failure' onClick={handleDeleteComment}>Yes, I am sure</Button>
                        <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default DashComments