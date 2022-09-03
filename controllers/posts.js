import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js"

export const getPosts = async (req, res) => {
    try {
        const postMessages = await PostMessage.find();

        console.log(postMessages);

        res.status(200).json(postMessages);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new PostMessage({ ...post, creator: req.UserId, createdAt: new Date().toISOString() })

    try {
        await newPost.save()
        
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id')

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {new: true});

    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

    await PostMessage.findByIdAndDelete(id);

    res.status(200).json({ message: 'Post deleted succesfully' })
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if( !req.UserId ) return res.status(401).json({ message: "Unauthenticated" });

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

    const post = await PostMessage.findById(id);
    
    //Check if user already liked the post
    const index = post.likes.findIndex((id) => id === String(req.UserId));

    if(index === -1){
        // like the post
        post.likes.push(req.UserId)
    } else{
        // dislike post
        post.likes = post.likes.filter((id) => id !== String(req.UserId));
    }
    
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true});

    res.json(updatedPost);
}