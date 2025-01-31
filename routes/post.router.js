const express = require("express");
const router = express.Router();
const { createPost, getAllPosts, deletePost, likeUnlikePost } = require("../controllers/post.controllers");
const authMiddleware = require("../middleware/auth.middleware")

router.route("/newPost").post(createPost);
router.route("/getPost").get(getAllPosts);
router.route("/deletePost/:id").delete(deletePost);
router.route("/likePost/:id").put(likeUnlikePost);


module.exports = router;