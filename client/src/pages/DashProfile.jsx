import { Alert, Button, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from './../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


const DashProfile = () => {
    const { currentUser } = useSelector(state => state.user)
    const [imgFile, setImgFile] = useState(null)
    const [imgFileUrl, setImgFileUrl] = useState(null);
    const filePickerRef = useRef(null)
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
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
    }, [imgFile])

    const uploadImage = async () => {
        setImageFileUploadError(null)
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
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImgFileUrl(downloadURL);
                })
            }
        )
    }

    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form className='flex flex-col flex justify-between gap-4'>
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
                    defaultValue={currentUser.username} />
                <TextInput type='text' id='email' placeholder='email'
                    defaultValue={currentUser.email} />
                <TextInput type='text' id='password' placeholder='password'
                />
                <Button type='submit' gradientDuoTone={'purpleToPink'} outline>Update</Button>
            </form>
            <div className="text-red-500 flex justify-between mt-5">
                <span className='cursor-pointer'>Delete Account</span>
                <span className='cursor-pointer'>Sign Out</span>
            </div>
        </div>
    )
}

export default DashProfile