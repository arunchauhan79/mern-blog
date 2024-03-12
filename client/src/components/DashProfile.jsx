import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure, deleteStart, deleteSuccess, deleteFailure, signoutSuccess } from '../redux/user/userSlice';
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { Link } from 'react-router-dom';


const DashProfile = () => {
    const dispatch = useDispatch()
    const { currentUser, error, loading } = useSelector(state => state.user)
    const [imgFile, setImgFile] = useState(null)
    const [imgFileUrl, setImgFileUrl] = useState(null);
    const filePickerRef = useRef(null)
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false)
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
    const [updateUserError, setUpdateUserError] = useState(null)
    const [formData, setFormData] = useState({})
    const [showConfirmations, setShowConfirmations] = useState(false);
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImgFile(file);
            setImgFileUrl(URL.createObjectURL(file))
        }
    }

    useEffect(() => {
        if (imgFileUrl) {
            uploadImage();
        }
    }, [imgFile]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleDeleteUser = async () => {
        setShowConfirmations(false);
        try {
            dispatch(deleteStart());

            const res = await fetch(`/api/user/delete${currentUser._id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(deleteFailure(data.message))
            }
            dispatch(deleteSuccess(data))
        } catch (error) {
            dispatch(deleteFailure(error.message));
        }

    }

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


    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null)

        if (Object.keys(formData).length === 0) {
            setUpdateUserError("Nothing to update")
            return
        }
        if (imageFileUploading) {
            setUpdateUserError("Please wait for image upload");
            return;
        }
        try {
            dispatch(updateStart());

            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(updateFailure(data.message))
                setUpdateUserError(data.message)
                return;
            }
            dispatch(updateSuccess(data));
            setUpdateUserSuccess("User's profile updated successfully")

        } catch (error) {
            dispatch(updateFailure(error.message))
            setUpdateUserError(error.message)

        }


    }

    const uploadImage = async () => {
        setImageFileUploadError(null)
        setImageFileUploading(true);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imgFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imgFile);
        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImageFileUploadProgress(progress.toFixed(0))
        },
            (error) => {
                setImageFileUploadError('Could not add image file (File must be less than 2MB)');
                setImageFileUploadProgress(null)
                setImgFile(null)
                setImgFileUrl(null)
                setImageFileUploading(false);

            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImgFileUrl(downloadURL);
                    setFormData({ ...formData, profilePicture: downloadURL })
                    setImageFileUploading(false);

                })
            }
        )
    }
    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form onSubmit={handleSubmit} className='flex flex-col flex justify-between gap-4'>
                <input type='file' accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />
                <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={() => filePickerRef.current.click()}>
                    {imageFileUploadProgress && (
                        <CircularProgressbar value={imageFileUploadProgress} text={`${imageFileUploadProgress}%`}
                            strokeWidth={5}
                            styles={{
                                root: {
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0
                                },
                                path: {
                                    stroke: `rgba(62,152,199,${imageFileUploadProgress / 100})`,
                                    transition: 'transform 0.5s ease-in-out',
                                }
                            }}
                        />
                    )}
                    <img src={imgFileUrl || currentUser.profilePicture} alt='user' className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`} /></div>
                {imageFileUploadError && (<Alert color={'failure'} >{imageFileUploadError}</Alert>)}
                <TextInput type='text' id='username' placeholder='username'
                    defaultValue={currentUser.username} onChange={handleChange} />
                <TextInput type='text' id='email' placeholder='email'
                    defaultValue={currentUser.email} onChange={handleChange} />
                <TextInput type='text' id='password' placeholder='password' onChange={handleChange}
                />
                <Button type='submit' gradientDuoTone={'purpleToPink'} outline disabled={loading || imageFileUploading}>
                    {loading ? 'loading...' : 'Update'}
                </Button>
                {currentUser.isAdmin &&
                    <Link to='/create-post'>
                        <Button gradientDuoTone={'purpleToPink'} className='w-full'>Create a post</Button> </Link>}

            </form>
            <div className="text-red-500 flex justify-between mt-5">
                <span className='cursor-pointer' onClick={() => setShowConfirmations(true)}>Delete Account</span>
                <span className='cursor-pointer' onClick={handleSignout}>Sign Out</span>
            </div>
            {
                updateUserSuccess && (
                    <Alert color={'success'} className='mt-5'>{updateUserSuccess}</Alert>
                )
            }
            {
                updateUserError && (
                    <Alert color={'failure'} className='mt-5'>{updateUserError}</Alert>
                )
            }
            {
                error && (
                    <Alert color={'failure'} className='mt-5'>{error}</Alert>
                )
            }
            {showConfirmations && <Modal
                show={showConfirmations}
                onClose={() => setShowConfirmations(false)}
                popup
                size={'md'}
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                    </div>
                    <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                        Are you sure you want to delete your account?
                    </h3>
                    <div className="flex justify-center gap-6">
                        <Button color='failure' onClick={handleDeleteUser}>Yes, I am sure</Button>
                        <Button color='gray' onClick={() => setShowConfirmations(false)}>No, cancel</Button>
                    </div>
                </Modal.Body>
            </Modal>}
        </div>
    )
}

export default DashProfile