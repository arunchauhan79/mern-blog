import { Button, Table, Modal, Avatar } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { FaCheck, FaTimes } from "react-icons/fa";

const Users = () => {
    const { currentUser } = useSelector(state => state.user);
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userId, setUserId] = useState("")
    useEffect(() => {

        const fetchUsers = async () => {
            try {
                const res = await fetch(`/api/user/getusers`);
                const data = await res.json();
                if (res.ok) {
                    setUsers(data.users)
                    if (data.users.length < 9) {
                        setShowMore(false)
                    }
                }
            }
            catch (error) {
                console.log(error.message)
            }
        }

        if (currentUser.isAdmin) {
            fetchUsers()
        }

    }, [currentUser._id]);

    const handleShowMore = async () => {
        const startIndex = users.length;
        try {
            const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setUsers((prev) => [...prev, ...data.users]);
                if (data.users.length < 9) {
                    setShowMore(false)
                }
            }
        } catch (error) {

        }
    }
    const handleDeleteUser = async () => {
        setShowModal(false)
        try {
            const res = fetch(`/api/user/delete/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },

            })
            const data = await res.json();
            if (res.ok) {
                setUsers(users.filter(user => user._id !== userId));
            } 
        } catch (error) {
            console.log(error.message)
        }
    }
    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.isAdmin && users.length > 0 ? (<>
                <Table hoverable className='shadow-md'>
                    <Table.Head>
                        <Table.HeadCell>Username</Table.HeadCell>
                        <Table.HeadCell>Profile Picture</Table.HeadCell>
                        <Table.HeadCell>Email</Table.HeadCell>
                        <Table.HeadCell>Updated At</Table.HeadCell>
                        <Table.HeadCell>Is Admin</Table.HeadCell>
                        <Table.HeadCell>Delete</Table.HeadCell>
                        <Table.HeadCell><span>Edit</span></Table.HeadCell>
                    </Table.Head>
                    {
                        users.map(user => (
                            <Table.Body className='divide-y'>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>
                                        <span>{user.username}</span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Avatar alt='user' img={user.profilePicture}
                                            rounded />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span>{user.email}</span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span>
                                            {new Date(user.updatedAt).toLocaleDateString()}
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span>
                                            {user.isAdmin ? <FaCheck className='text-green-400' /> : <FaTimes className='text-red-400' />}
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell >
                                        <span onClick={() => {
                                            setShowModal(true);
                                            setUserId(user._id);
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
                <p>There is no user</p>
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
                        Are you sure you want to delete this user?
                    </h3>
                    <div className="flex justify-center gap-6">
                        <Button color='failure' onClick={handleDeleteUser}>Yes, I am sure</Button>
                        <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Users