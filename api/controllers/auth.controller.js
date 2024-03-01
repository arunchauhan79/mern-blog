import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js';

export const signup = async (req, res, next) => {

    const { username, email, password } = req.body;
    if (!username || !email || !password || username === '' || email === '' || password === '') {
        next(errorHandler(500, 'All fields are required'))
    }

    const hashPassword = bcryptjs.hashSync(password, 10)
    const newUser = new User({
        username,
        email,
        password: hashPassword
    });

    try {
        const createdUser = await newUser.save();
        res.send(createdUser)
    } catch (error) {
        next(error)
        // res.status(500).json({ message: error.message })
    }
}