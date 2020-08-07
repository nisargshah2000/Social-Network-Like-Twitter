const mongoose = require("mongoose");
let uuidv1 = require("uuidv1");
const crypto = require("crypto");
const Post = require("./post");

const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    hashed_password: {
        type: String,
        required: true,
    },
    salt: String,
    created: {
        type: Date,
        default: Date.now,
    },
    updated: Date,
    photo: {
        data: Buffer,
        contentType: String,
    },
    about: {
        type: String,
        trim: true,
    },
    following: [{ type: ObjectId, ref: "User" }],
    followers: [{ type: ObjectId, ref: "User" }],
    resetPasswordLink: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        default: "subscriber",
    },
});

userSchema
    .virtual("password")
    .set(function (password) {
        //Store password in Tempopary Variable
        this._password = password;
        //Generate Time Stamp
        this.salt = uuidv1();
        // Encrypt the password and then save
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

userSchema.methods = {
    authenticate: function (password) {
        return this.encryptPassword(password) === this.hashed_password;
    },

    encryptPassword: function (password) {
        if (!password) return "";

        try {
            return crypto
                .createHmac("sha256", this.salt)
                .update(password)
                .digest("hex");
        } catch (error) {
            return "";
        }
    },
};

// pre middleware
userSchema.pre("remove", function (next) {
    Post.remove({ postedBy: this._id }).exec();
    next();
});

module.exports = mongoose.model("User", userSchema);
