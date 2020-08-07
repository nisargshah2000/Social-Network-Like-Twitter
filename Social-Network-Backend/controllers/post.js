const Post = require("../models/post");
const express = require("express");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");

exports.postById = (req, res, next, id) => {
    Post.findById(id)
        .populate("postedBy", "_id name role")
        .populate("comments", "text created")
        .populate("comments.postedBy", "_id name")
        .exec((err, post) => {
            if (err) {
                return res.status(400).json({
                    error: err,
                });
            }

            req.post = post;

            next();
        });
};

exports.getPost = (req, res) => {
    //get current page from req.query or use default value of 1
    const currentPage = req.query.page || 1;
    //return 3 posts per page
    const perPage = 3;
    let totalItems;

    const posts = Post.find()
        //countDocuments() gives you total count of posts
        .countDocuments()
        .then((count) => {
            totalItems = count;
            return Post.find()
                .skip((currentPage - 1) * perPage)
                .populate("comments", "text created")
                .populate("comments.postedBy", "_id name")
                .populate("postedBy", "_id name")
                .sort({ created: -1 })
                .limit(perPage)
                .select("_id title body likes created");
        })
        .then((posts) => {
            res.status(200).json(posts);
        })
        .catch((err) => console.log(err));
};

exports.createPost = (req, res, next) => {
    let form = formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Problem in uploading the Imagae",
            });
        }

        const { title, body } = fields;

        if (!title) {
            return res.status(400).json({
                error: "Title must not be Empty",
            });
        }

        if (!body) {
            return res.status(400).json({
                error: "Body must not be Empty",
            });
        }

        if (title.length < 4 || title.length > 200) {
            return res.status(400).json({
                error: "Title must be between 4 to 150 Characters",
            });
        }

        if (body.length < 4 || body.length > 2000) {
            return res.status(400).json({
                error: "Post Content must be between 4 to 2000 Characters",
            });
        }

        let post = new Post(fields);

        req.profile.salt = undefined;
        req.profile.hashed_password = undefined;
        post.postedBy = req.profile;

        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }

        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err,
                });
            }

            return res.json(result);
        });
    });
};

exports.postsByUser = (req, res) => {
    Post.find({ postedBy: req.profile._id })
        .populate("postedBy", "_id name")
        .select("_id title body created likes")
        .sort("_created")
        .exec((err, posts) => {
            if (err) {
                return res.status(400).json({
                    error: err,
                });
            }

            return res.json(posts);
        });
};

exports.isPoster = (req, res, next) => {
    let sameUser =
        req.post && req.auth && req.post.postedBy._id == req.auth._id;
    let adminUser = req.post && req.auth && req.auth.role == "admin";

    let isPoster = sameUser || adminUser;

    if (!isPoster) {
        return res.status(403).json({
            error: "You are not authorized to perform this Action",
        });
    }

    next();
};

exports.updatePost = (req, res, next) => {
    let form = formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Problem in uploading the Imagae",
            });
        }
        let post = req.post;
        post = _.extend(post, fields);
        post.updated = Date.now();

        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }

        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err,
                });
            }

            return res.json(result);
        });
    });
};

exports.deletePost = (req, res) => {
    let post = req.post;
    post.remove((err, post) => {
        if (err) {
            return res.status(400).json({
                error: err,
            });
        }

        res.json({
            message: "Post deleted Successfully",
        });
    });
};

exports.postPhoto = (req, res, next) => {
    if (req.post.photo.data) {
        res.set("Content-Type", req.post.photo.contentType);
        return res.send(req.post.photo.data);
    }
    next();
};

exports.getSinglePost = (req, res) => {
    return res.json(req.post);
};

exports.like = (req, res) => {
    Post.findByIdAndUpdate(
        req.body.postId,
        { $push: { likes: req.body.userId } },
        { new: true }
    ).exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err,
            });
        }
        return res.json(result);
    });
};

exports.unlike = (req, res) => {
    Post.findByIdAndUpdate(
        req.body.postId,
        { $pull: { likes: req.body.userId } },
        { new: true }
    ).exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err,
            });
        }
        return res.json(result);
    });
};

exports.comment = (req, res) => {
    let comment = req.body.comment;
    comment.postedBy = req.body.userId;
    Post.findByIdAndUpdate(
        req.body.postId,
        { $push: { comments: comment } },
        { new: true }
    )
        .populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err,
                });
            }
            return res.json(result);
        });
};

exports.uncomment = (req, res) => {
    let comment = req.body.comment;
    Post.findByIdAndUpdate(
        req.body.postId,
        { $pull: { comments: { _id: comment._id } } },
        { new: true }
    )
        .populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err,
                });
            }
            return res.json(result);
        });
};
