import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import { createComment, getPostComments, likeComment, editComment, deleteComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.post('/create', verifyUser
    , createComment);
router.get('/getPostComments/:postId', getPostComments);
router.put('/likeComment/:commentId', verifyUser, likeComment)
router.put('/editComment/:commentId', verifyUser, editComment)
router.delete('/deleteComment/:commentId', verifyUser, deleteComment)

export default router;