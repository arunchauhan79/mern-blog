import Comment from '../models/comment.model.js'
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