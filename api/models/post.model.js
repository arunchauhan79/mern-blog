import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.hostinger.co.uk%2Ftutorials%2Fhow-to-write-a-blog-post&psig=AOvVaw22jMxZMxYl9xhOetP4V2ON&ust=1710393895234000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCMialfi_8IQDFQAAAAAdAAAAABAI"
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        default: 'uncategorized'
    }


}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
export default Post;