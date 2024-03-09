import { Button } from 'flowbite-react'
import React from 'react'
import { app } from '../firebase.js';
import { AiFillGoogleCircle } from 'react-icons/ai'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { signInSuccess, signInFailure } from '../redux/user/userSlice.js'
import { useNavigate } from 'react-router-dom';

const OAuth = () => {
    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {

        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account'
        })
        try {

            const resultsFromGoogle = await signInWithPopup(auth, provider);
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL
                })
            })
            const data = await res.json();
            if (res.ok) {
                dispatch(signInSuccess(data));
                navigate('/')
            }
        } catch (error) {
            console.error('Error signing in with Google:', error);
        }
    }

    return (
        <Button outline gradientDuoTone='pinkToOrange' onClick={handleGoogleClick} >
            <AiFillGoogleCircle className='w-6 h-6 mr-1' />
            Continue with Google
        </Button>
    )
}

export default OAuth