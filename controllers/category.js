import express from "express";
import Mongoose from "mongoose";
import Categories from "../models/categories.js";

const router = express.Router();
// fetch All Items
export const getCategories = async (req, res) => {
  try {
    Categories.find()
      .sort({ date: -1 })
      .then((categories) => res.json(categories));
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
};
// Fetch single item
export const getCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Categories.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
};
// Add new Category

export const createCategory = async (req, res) => {
  const { name, description } = req.body;
  const newCategory = new Categories({ name, description });
  try {
    await newCategory.save();
    res.status(200).json(newCategory);
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
};
// Delete Category
export const deleteCategory = async (req, res) => {
  Categories.findById(req.params.id)
    .then((category) =>
      category.remove().then(() => res.json({ success: true }))
    )
    .catch((err) => res.status(200).json({ success: false }));
};
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  if (!Mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id");

  const updatedCategory = { name, description, _id: id };
  await Categories.findByIdAndUpdate(id, updatedCategory, { new: true });
  res.json(updatedCategory);
};

export default router;
