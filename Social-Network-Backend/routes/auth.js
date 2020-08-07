const express = require("express");
const {
    signup,
    signin,
    signout,
    forgotPassword,
    resetPassword,
    socialLogin,
} = require("../controllers/auth");
const {
    userSignupValidator,
    passwordResetValidator,
} = require("../validator/index");
const { userById } = require("../controllers/user");

const router = express.Router();

// password forgot and reset routes
router.put("/forgot-password", forgotPassword);
router.put("/reset-password", passwordResetValidator, resetPassword);
router.post("/social-login", socialLogin);

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);

// Any route containing userId as parameter will first execute userById
router.param("userId", userById);

module.exports = router;
