// const express=require("express");
import express from "express";
import {getPost, createpost, updatePost, deletePost, getposts, filterCategory} from "../controllers/posts.js"
// import createpost from "../controllers/register.js";
const router = express.Router();

// Localhost:5000/posts
//this is method 1

// router.get('/',(req,res)=>{
//     res.send("this works");
// });

router.get("/:id", getPost);
router.get('/', getposts);
router.get('/filter/:filter',filterCategory);
router.post("/", createpost);
router.patch('/:id',updatePost);
router.delete('/:id', deletePost);
export default router;