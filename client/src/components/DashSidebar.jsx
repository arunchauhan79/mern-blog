import { Sidebar } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { HiArrowSmRight, HiChartPie, HiDocumentText, HiUser, HiUsers } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const DashSidebar = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { currentUser } = useSelector(state => state.user)
    const [tab, setTab] = useState('');
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);
    const handleSignout = async () => {
        try {
            const res = await fetch(`/api/user/signout`, {
                method: 'POST'
            })
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                dispatch(signoutSuccess());
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    return (
        <Sidebar className='w-full md:w-56'>
            <Sidebar.ItemGroup className='flex flex-col gap-1'>
                {
                    currentUser.isAdmin && <Link to='/dashboard?tab=dash'>
                        <Sidebar.Item active={tab === 'dash' || !tab} icon={HiChartPie} labelColor='dark' as='div'>Dashboard</Sidebar.Item>
                    </Link>
                }

                <Link to='/dashboard?tab=profile'>
                    <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? 'Admin' : 'User'} labelColor='dark' as='div'>Profile</Sidebar.Item>
                </Link>

                {
                    currentUser.isAdmin &&
                    <Link to='/dashboard?tab=posts'>
                        <Sidebar.Item active={tab === 'posts'} icon={HiDocumentText} labelColor='dark' as='div'>Posts</Sidebar.Item>
                    </Link>
                }{
                    currentUser.isAdmin &&
                    <Link to='/dashboard?tab=users'>
                            <Sidebar.Item className='cursor-pointer' icon={HiUsers} as='div'>Users</Sidebar.Item>
                    </Link>
                }
                {
                    currentUser.isAdmin &&
                    <Link to='/dashboard?tab=comments'>
                        <Sidebar.Item active={tab === 'comments'} icon={HiDocumentText} labelColor='dark' as='div'>Comments</Sidebar.Item>
                    </Link>
                }
                <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignout}>Sign Out</Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar>
    )
}

export default DashSidebar