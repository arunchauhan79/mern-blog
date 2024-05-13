import React from 'react'

const About = () => {
    return (
        <div className='min-h-screen flex items-center justify-center'>

            <div className='max-w-2xl mx-auto p-3 text-center'>
                <div>
                    <h1 className='text-3xl font-semibold text-center my-7'>About Arun's blog</h1>
                    <div className='text-md text-gray-500 flex flex-col gap-6'>
                        <p>
                            This is a blog created by Arun. This blog is created using MERN stack.
                            MERN stack is a full stack of technologies that are used to create web applications.
                            MERN stack consists of MongoDB, Express, React, and Node.js.
                            This blog is created using MongoDB as the database, Express as the backend framework, React as the frontend framework, and Node.js as the backend runtime environment.
                        </p>
                        <p>
                            This blog is created to share my thoughts and ideas with the world.
                            I will be writing articles on various topics such as technology, programming,
                            science, and other interesting topics. I hope you enjoy reading my articles and find them informative and entertaining.
                        </p>
                        <p>
                            If you have any questions or comments about my blog, please feel free to contact me.
                            I would love to hear from you and get your feedback on my articles.
                            Thank you for visiting my blog and I hope you enjoy reading my articles.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default About