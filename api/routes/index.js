import { Router } from "express";
import authRouter from './auth.route.js'
import userRouter from './user.route.js'
import postRouter from './post.route.js'


export default Router().use('/auth', authRouter)
    .use('/user', userRouter)
    .use('/post', postRouter)