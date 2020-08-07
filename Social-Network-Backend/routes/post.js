const express = require("express");
const {
    getPost,
    createPost,
    postsByUser,
    postById,
    isPoster,
    deletePost,
    updatePost,
    postPhoto,
    getSinglePost,
    like,
    unlike,
    comment,
    uncomment,
} = require("../controllers/post");
const { requireSignin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

const router = express.Router();

router.put("/post/like", requireSignin, like);
router.put("/post/unlike", requireSignin, unlike);

router.put("/post/comment", requireSignin, comment);
router.put("/post/uncomment", requireSignin, uncomment);

router.get("/posts", getPost);
router.get("/post/:postId", getSinglePost);
router.post("/post/new/:userId", requireSignin, createPost);
router.get("/posts/by/:userId", requireSignin, postsByUser);
router.delete("/post/:postId", requireSignin, isPoster, deletePost);
router.put("/post/:postId", requireSignin, isPoster, updatePost);

router.get("/post/photo/:postId", postPhoto);

// Any route containing userId as parameter will first execute userById
router.param("userId", userById);
// Any route containing postId as parameter will first execute postById
router.param("postId", postById);

module.exports = router;
