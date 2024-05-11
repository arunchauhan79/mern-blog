import { Button, Select, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from './../components/PostCard';

const Search = () => {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'uncategorized'
    })
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const sortFromUrl = urlParams.get('sort');
        const categoryFromUrl = urlParams.get('category');
        if (searchTermFromUrl) {
            setSidebarData({
                ...sidebarData,
                searchTerm: searchTermFromUrl,
                sort: sortFromUrl || 'desc',
                category: categoryFromUrl || 'uncategorized'
            })
        }

        const fetchPosts = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            try {
                const res = await fetch(`/api/post/getposts?${searchQuery}`);
                if (!res.ok) {
                    setLoading(false);
                    console.log(data.message);
                } else {
                    const data = await res.json();
                    setPosts(data.posts);
                    setLoading(false);
                    if (data.posts.length === 9) {
                        setShowMore(true);
                    } else {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
            setLoading(false);
        }

        fetchPosts();
    }, [location.search]);

    const handleChange = (e) => {
        if (e.target.id === 'searchTerm') {
            setSidebarData({
                ...sidebarData,
                searchTerm: e.target.value
            })
        }
        if (e.target.id === 'sort') {
            setSidebarData({
                ...sidebarData,
                sort: e.target.value || 'desc'
            })
        }

        if (e.target.id === 'category') {
            setSidebarData({
                ...sidebarData,
                category: e.target.value || 'uncategorized'
            })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('category', sidebarData.category);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);

    }

    const handleShowMore = async () => {
        const startIndex = posts.length;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/post/getposts?${searchQuery}`);
        if (!res.ok) {
            console.log('error fetching posts');
        }
        else {
            const data = await res.json();
            setPosts([...posts, ...data.posts]);
            if (data.posts.length < 9) {
                setShowMore(false);
            }
        }
    }
    return (
        <div className='flex flex-col md:flex-row'>
            <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
                <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                        <TextInput placeholder='Search...' type='text' id='searchTerm' value={sidebarData.searchTerm} onChange={handleChange} />
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold'>Sort:</label>
                        <Select onChange={handleChange}
                            value={sidebarData.sort}
                            id='sort'>
                            <option value='desc'>Latest</option>
                            <option value='asc'>Oldest</option>
                        </Select>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold'>Category:</label>
                        <Select onChange={handleChange}
                            value={sidebarData.category}
                            id='category'>
                            <option value='uncategorized'>Uncategorized</option>
                            <option value='reactjs'>ReactJs</option>
                            <option value='nextjs'>NextJs</option>
                            <option value='javascript'>Javascript</option>
                        </Select>
                    </div>
                    <Button type='submit' gradientDuoTone={'purpleToPink'} outline>Apply Filter</Button>
                </form>
            </div>
            <div className='w-full'>
                <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>Post results</h1>
                <div className='p-7 flex flex-wrap gap-4'>
                    {!loading && posts.length === 0 && (<p className='text-xl text-gray-500'>
                        No posts found
                    </p>)}
                    {loading && (<p className='text-xl text-gray-500'>Loading...</p>)}
                    {!loading && posts && posts.map((post, index) => <PostCard key={post._id} post={post} />)}
                    {
                        showMore && <button className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-2 rounded-lg mt-5 w-full' onClick={handleShowMore}>show more</button>}
                </div>
            </div>
        </div>
    )
}

export default Search