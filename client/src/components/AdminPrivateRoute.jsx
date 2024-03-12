import { current } from '@reduxjs/toolkit';
import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

const AdminPrivateRoute = () => {
    const { currentUser } = useSelector(state => state.user);
    return current && currentUser.isAdmin ? <Outlet /> : <Navigate to='/sign-in' />;
}

export default AdminPrivateRoute