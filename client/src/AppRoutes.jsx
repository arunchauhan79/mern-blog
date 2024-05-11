import React from 'react'
import { Route, Routes } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import AdminPrivateRoute from './components/AdminPrivateRoute'
import Home from './pages/Home'
import About from './pages/About'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import CreatePost from './pages/CreatePost'
import UpdatePost from './pages/UpdatePost'
import Projects from './pages/Projects'
import PostPage from './pages/PostPage'
import Search from './pages/Search'

const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/sign-in' element={<SignIn />} />
            <Route path='/sign-up' element={<SignUp />} />
            <Route path='/search' element={<Search />} />
            <Route element={<PrivateRoute />}>
                <Route path='/dashboard' element={<Dashboard />} />
            </Route>
            <Route element={<AdminPrivateRoute />}>
                <Route path='/create-post' element={<CreatePost />} />
                <Route path='/update-post/:postId' element={<UpdatePost />} />
            </Route>
            <Route path='/projects' element={<Projects />} />
            <Route path='/post/:slug' element={<PostPage />} />
        </Routes>
    )
}

export default AppRoutes