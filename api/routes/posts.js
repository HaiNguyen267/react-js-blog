import express from 'express' 
import { addPost, deletePost, getPosts, updatePost, getPost } from '../controllers/post.js'
const router = express.Router()

router.get("/", getPosts)
router.get("/?category=:category", getPosts)
router.get("/:id", getPost)
router.post("/", addPost)
router.delete("/:id", deletePost)
router.put("/:id", updatePost)


router.get("/hello", addPost)

export default router