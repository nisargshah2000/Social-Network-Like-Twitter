const express = require("express");
const {
    userById,
    allUsers,
    getUser,
    updateUser,
    deleteUser,
    userPhoto,
    addFollower,
    addFollowing,
    removeFollower,
    removeFollowing,
    findPeople,
    hasAuthorization,
} = require("../controllers/user");
const { requireSignin } = require("../controllers/auth");

const router = express.Router();

router.put("/user/follow", requireSignin, addFollowing, addFollower);
router.put("/user/unfollow", requireSignin, removeFollowing, removeFollower);

router.get("/users", allUsers);
router.get("/user/:userId", requireSignin, getUser);
router.put("/user/:userId", requireSignin, hasAuthorization, updateUser);
router.delete("/user/:userId", requireSignin, hasAuthorization, deleteUser);

router.get("/user/findpeople/:userId", requireSignin, findPeople);

router.get("/user/photo/:userId", userPhoto);

// Any route containing userId as parameter will first execute userById
router.param("userId", userById);

module.exports = router;
