const _ = require("lodash");
const { sendEmail } = require("../helpers");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
require("dotenv").config();
const User = require("../models/user");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

exports.signup = async (req, res) => {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
        return res.status(403).json({
            error: "Account with this Email already Exists !!",
        });
    }

    const user = await new User(req.body);
    await user.save();
    res.json({ message: "Signup Success !! Please Login." });
};

exports.signin = (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email }, (err, user) => {
        //Error
        if (err) {
            return res.status(400).json({
                error: "Some Error Occured",
            });
        }

        //User does not exist
        if (!user) {
            return res.status(401).json({
                error: "User with given email does not exist. Please Sign Up.",
            });
        }

        //Match email and password
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and Password does not Match",
            });
        }

        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET
        );
        res.cookie("t", token, { expire: new Date() + 9999 });

        const { _id, email, name, role } = user;
        return res.json({
            token,
            user: {
                _id,
                name,
                email,
                role,
            },
        });
    });
};

exports.signout = (req, res) => {
    res.clearCookie("t");
    res.json({
        message: "Sign out successfully",
    });
};

exports.requireSignin = expressJwt({
    algorithms: ["HS256"],
    secret: process.env.JWT_SECRET,
    userProperty: "auth",
});

// forgotPassword and resetPassword methods
exports.forgotPassword = (req, res) => {
    if (!req.body) return res.status(400).json({ error: "No request body" });
    if (!req.body.email)
        return res.status(400).json({ error: "Email Is Required" });

    const { email } = req.body;
    // find the user based on email
    User.findOne({ email }, (err, user) => {
        // if err or no user
        if (err || !user)
            return res.status("401").json({
                error: "User with that email does not exist!",
            });

        // generate a token with user id and secret
        const token = jwt.sign(
            { _id: user._id, iss: "NODEAPI" },
            process.env.JWT_SECRET
        );

        // email data
        const emailData = {
            from: "noreply@node-react.com",
            to: email,
            subject: "Password Reset Instructions",
            text: `Please use the following link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`,
            html: `<p>Please use the following link to reset your password:</p> <p>${process.env.CLIENT_URL}/reset-password/${token}</p>`,
        };

        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
            if (err) {
                return res.json({ message: err });
            } else {
                sendEmail(emailData);
                return res.status(200).json({
                    message: `Email has been sent to ${email}. Follow the instructions to reset your password.`,
                });
            }
        });
    });
};

// to allow user to reset password
// first you will find the user in the database with user's resetPasswordLink
// user model's resetPasswordLink's value must match the token
// if the user's resetPasswordLink(token) matches the incoming req.body.resetPasswordLink(token)
// then we got the right user

exports.resetPassword = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;

    User.findOne({ resetPasswordLink }, (err, user) => {
        // if err or no user
        if (err || !user)
            return res.status("401").json({
                error: "Invalid Link!",
            });

        const updatedFields = {
            password: newPassword,
            resetPasswordLink: "",
        };

        user = _.extend(user, updatedFields);
        user.updated = Date.now();

        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err,
                });
            }
            res.json({
                message: `Great! Now you can login with your new password.`,
            });
        });
    });
};

exports.socialLogin = async (req, res) => {
    const idToken = req.body.tokenId;
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    });
    const {
        email_verified,
        email,
        name,
        picture,
        sub: googleid,
    } = ticket.getPayload();

    if (email_verified) {
        const newUser = { email, name, password: googleid };
        // try signup by finding user with req.email
        let user = User.findOne({ email }, (err, user) => {
            if (err || !user) {
                // create a new user and login
                user = new User(newUser);
                req.profile = user;
                user.save();
                // generate a token with user id and secret
                const token = jwt.sign(
                    { _id: user._id, iss: process.env.APP_NAME },
                    process.env.JWT_SECRET
                );
                res.cookie("t", token, { expire: new Date() + 9999 });
                // return response with user and token to frontend client
                const { _id, name, email } = user;
                return res.json({ token, user: { _id, name, email } });
            } else {
                // update existing user with new social info and login
                req.profile = user;
                newUser.password = undefined;
                user = _.extend(user, newUser);
                user.updated = Date.now();
                user.save();
                // generate a token with user id and secret
                const token = jwt.sign(
                    { _id: user._id, iss: process.env.APP_NAME },
                    process.env.JWT_SECRET
                );
                res.cookie("t", token, { expire: new Date() + 9999 });
                // return response with user and token to frontend client
                const { _id, name, email } = user;
                return res.json({ token, user: { _id, name, email } });
            }
        });
    }
};
