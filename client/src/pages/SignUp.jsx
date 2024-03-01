import { Button, Label, TextInput } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'

const SignUp = () => {
    return (
        <div className='min-h-screen mt-20'>
            <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
                {/* left */}
                <div className="">
                    <Link to='/' className='font-bold text-4xl dark:text-white'>
                        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Arun's</span> Blog
                    </Link>
                    <p className='text-sm mt-5'>This is demo project. You can sign up with username/password and google account.</p>
                </div>
                {/* right */}
                <div className="flex-1">
                    <form className='flex flex-col gap-4'>
                        <div>
                            <Label value='Your username'></Label>
                            <TextInput placeholder='Username' type='text' id='username'></TextInput>
                        </div>
                        <div>
                            <Label value='Your email'></Label>
                            <TextInput placeholder='Email' type='text' id='email'></TextInput>
                        </div>
                        <div>
                            <Label value='Your password'></Label>
                            <TextInput placeholder='Password' type='text' id='password'></TextInput>
                        </div>
                        <Button gradientDuoTone='purpleToPink' type='submit'>Sign Up</Button>
                    </form>
                    <div className="flex gap-2 text-sm mt-5"><span>Have an account?</span>
                        <Link to='/sign-in' className='text-blue-500'>Sign In</Link></div>

                </div>

            </div>
        </div>
    )
}

export default SignUp