import Mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";
import Express from "express";

const router = Express.Router();

export const getposts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find();
    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const filterCategory = async (req, res) => {
  const { filter } = req.params;
  // console.log("Filtering");
  try {
    const filtercategory = await PostMessage.find({ category: filter });
    res.status(200).json(filtercategory);
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
};
export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await PostMessage.findById(id);

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createpost = async (req, res) => {
  // res.send("post creation");
  const { category, description, selectedFile, name, price } = req.body;
  const newPost = new PostMessage({
    category,
    description,
    selectedFile,
    name,
    price,
  });
  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { category, description, selectedFile, name, price } = req.body;
  if (!Mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id");

  const updatedPost = {
    name,
    category,
    description,
    price,
    selectedFile,
    _id: id,
  };
  await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });
  res.status(200).json(updatedPost);
};

export const deletePost = async (req, res) => {
  // console.log("delete");
  const { id } = req.params;
  if (!Mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  await PostMessage.findByIdAndRemove(id);

  res.status(200).json({ message: "Post deleted successfully." });
};
export default router;
