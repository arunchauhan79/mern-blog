import Comment from '../models/comment.model.js'
import { errorHandler } from '../utils/error.js';
export const createComment = async (req, res, next) => {

    try {
        const { content, userId, postId } = req.body;
        if (req.user.id !== userId) {
            return next(errorHandler(403, 'You are not allowed to create this comment'));
        }

        const newComment = new Comment({
            content,
            userId,
            postId
        });
        await newComment.save();
        res.status(200).json(newComment);

    } catch (error) {
        next(error);
    }

}

export const getPostComments = async (req, res, next) => {

    try {
        const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        next(error)
    }

}

export const likeComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return next(errorHandler(404, 'Comment not found'))

        const userIndex = comment.likes.indexOf(req.user.id);
        if (userIndex === -1) {
            comment.likes.push(req.user.id);
            comment.numberOfLikes += 1;
        } else {
            comment.likes.splice(userIndex, 1);
            comment.numberOfLikes -= 1;
        }
        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        next(error);
    }
}

export const editComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return next(errorHandler(404, 'Comment not found'))

        if (req.user.id !== comment.userId && !req.user.isAdmin === false) {
            return next(errorHandler(403, 'You are not allowed to edit this comment'));
        }

        const editedComment = await Comment.findByIdAndUpdate(req.params.commentId, {
            content: req.body.content
        },
            { new: true });
        res.status(200).json(editedComment);

    } catch (error) {
        next(error);
    }
}

export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return next(errorHandler(404, 'Comment not found'))

        if (req.user.id !== comment.userId && !req.user.isAdmin === false) {
            return next(errorHandler(403, 'You are not allowed to edit this comment'));
        }

        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json("Comment has been deleted");

    } catch (error) {
        next(error);
    }
}

export const getComments = async (req, res, next) => {

    if (!req.user.isAdmin) return next(errorHandler(403, 'You are not allowed to get all comments'));

    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === "desc" ? -1 : 1;
        const comments = await Comment.find().sort({ createdAt: sortDirection }).skip(startIndex).limit(limit);
        const totalComments = await Comment.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
        const lastMonthComments = await Comment.find({ createdAt: { $gte: oneMonthAgo } }).countDocuments();
        res.status(200).json({ comments, totalComments, lastMonthComments });
    }
    catch (error) {
        next(error)
    }
}