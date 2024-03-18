import express from 'express';
import { verifyUser } from './../utils/verifyUser.js';
import { create, deletepost, getPosts } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', verifyUser, create);
router.get('/getPosts', getPosts)
router.delete('/deletepost/:postId/:userId', verifyUser, deletepost)

export default router;