import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import serviceRouter from './routes/index.js'

dotenv.config()
mongoose.connect(process.env.MONGO, {
    appname: 'mern-blog'
}).then(() => {
    console.log("MongoDB is connected")
}).catch(err => {
    console.log(err)
})

const app = express();
app.use(express.json());
app.use(cookieParser());

//Routes
app.use('/api', serviceRouter)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})






app.listen(3000, () => {
    console.log("server is running on 3000")
})
