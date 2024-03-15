import { Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const DashPosts = () => {
    const { currentUser } = useSelector(state => state.user);
    const [userPosts, getUserPosts] = useState([]);

    useEffect(() => {

        const fetchPosts = async () => {
            try {
                const res = await fetch(`/api/post/getPosts?userId=${currentUser._id}`);
                const data = await res.json();
                if (res.ok) {
                    getUserPosts(data.posts)
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
    console.log(userPosts)
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
                                    <Table.Cell>
                                        <span className='font-medium text-red-500 hover:underline cursor-pointer'>Delete</span>
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
            </>) : (<div>
                <p>There is no post</p>
            </div>)}
        </div>
    )
}

export default DashPosts