import { Router } from "express";
import authRouter from './auth.route.js'
import userRouter from './user.route.js'


export default Router().use('/auth', authRouter)
    .use('/user', userRouter)