import { Button, Table, Modal } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const DashPosts = () => {
    const { currentUser } = useSelector(state => state.user);
    const [userPosts, setUserPosts] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [postId, getPostId] = useState(null)

    useEffect(() => {

        const fetchPosts = async () => {
            try {
                const res = await fetch(`/api/post/getPosts?userId=${currentUser._id}`);
                const data = await res.json();
                if (res.ok) {
                    setUserPosts(data.posts)
                    if (data.posts.length < 9) {
                        setShowMore(false)
                    }
                }
            }
            catch (error) {
                console.log(error.message)
            }
        }

        if (currentUser.isAdmin) {
            fetchPosts()
        }

    }, [currentUser._id]);

    const handleShowMore = async () => {
        const startIndex = userPosts.length;
        try {
            const res = await fetch(`/api/post/getPosts?userId=${currentUser._id}&startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setUserPosts((prev) => [...prev, ...data.posts]);
                if (data.posts.length < 9) {
                    setShowMore(false)
                }
            }
        } catch (error) {

        }
    }



    const handleDeletePost = async () => {
        setShowModal(false)
        try {
            const res = fetch(`/api/post/deletepost/${postId}/${currentUser._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },

            })
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message)
            } else {
                setUserPosts((prev) =>
                    prev.filter(post => post._id !== postId));
            }

        } catch (error) {
            console.log(error.message)
        }
    }
    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.isAdmin && userPosts.length > 0 ? (<>
                <Table hoverable className='shadow-md'>
                    <Table.Head>
                        <Table.HeadCell>Date updated</Table.HeadCell>
                        <Table.HeadCell>Post image</Table.HeadCell>
                        <Table.HeadCell>Post title</Table.HeadCell>
                        <Table.HeadCell>Category</Table.HeadCell>
                        <Table.HeadCell>Delete</Table.HeadCell>
                        <Table.HeadCell><span>Edit</span></Table.HeadCell>
                    </Table.Head>
                    {
                        userPosts.map(post => (
                            <Table.Body className='divide-y'>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>
                                        {new Date(post.updatedAt).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/post/${post.slug}`}>
                                            <img src={post.image}
                                                alt={post.title}
                                                className='w-20 h-20 object-cover bg-slate-500'
                                            />
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/post/${post.slug}`}>
                                            <span>{post.title}</span>
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span>
                                            {post.category}
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell >
                                        <span onClick={() => {
                                            setShowModal(true);
                                            getPostId(post._id);
                                        }} className='font-medium text-red-500 hover:underline cursor-pointer'>Delete</span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link className='font-medium text-teal-500  hover:underline cursor-pointer' to={`/update-post/${post._id}`}>
                                            <span>Edit</span>
                                        </Link>

                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))
                    }
                </Table>
                {
                    showMore &&
                    <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
                        Show more
                    </button>
                }
            </>) : (<div>
                <p>There is no post</p>
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
                        Are you sure you want to delete this post?
                    </h3>
                    <div className="flex justify-center gap-6">
                        <Button color='failure' onClick={handleDeletePost}>Yes, I am sure</Button>
                        <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default DashPosts