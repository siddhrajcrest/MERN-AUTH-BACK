import express from "express";
import { getCategory, getCategories, createCategory, updateCategory, deleteCategory } from "../controllers/category.js";
// import createpost from "../controllers/register.js";
const router = express.Router();

// Localhost:5000/posts
//this is method 1

// router.get('/',(req,res)=>{
//     res.send("this works");
// });

router.get("/:id", getCategory);
router.get('/', getCategories);
router.post("/", createCategory);
router.patch('/:id',updateCategory);
router.delete('/:id', deleteCategory);
export default router;