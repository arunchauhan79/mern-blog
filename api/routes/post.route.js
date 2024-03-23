import express from 'express';
import { verifyUser } from './../utils/verifyUser.js';
import { UpdatePost, create, deletepost, getPosts } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', verifyUser, create);
router.get('/getPosts', getPosts)
router.delete('/deletepost/:postId/:userId', verifyUser, deletepost)
router.put('/updatePost/:postId/:userId', verifyUser, UpdatePost)


export default router;