import React, { useState, useEffect } from "react";
import { create } from "./apiPost";
import { isAuthenticated } from "../auth/index";
import { Redirect } from "react-router-dom";

function NewPost(props) {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [imageSize, setImageSize] = useState(0);
    const [error, setError] = useState("");
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [redirectToProfile, setRedirectToProfile] = useState(false);

    let postData = new FormData();

    useEffect(() => {
        setUser(isAuthenticated().user);
    }, [props.match.params.userId]);

    function handleChange(event) {
        setError("");

        if (event.target.name === "photo" && event.target.files[0]) {
            setImage(event.target.files[0]);
            setImageSize(event.target.files[0].size);
        } else if (event.target.name === "title") {
            setTitle(event.target.value);
        } else if (event.target.name === "body") {
            setBody(event.target.value);
        }
    }

    function isValid() {
        if (title.length === 0) {
            setError("Title is Required");
            return false;
        }

        if (body.length === 0) {
            setError("Post Content is Required");
            return false;
        }

        if (imageSize > 1024 * 1024) {
            setError("File size should be less than 1 MB");
            return false;
        }

        if (title.length < 4 || title.length > 150) {
            setError("Title must be 4 to 150 Characters Long");
            return false;
        }

        if (body.length < 4 || body.length > 2000) {
            setError("Post Content must be 4 to 2000 Characters Long");
            return false;
        }

        return true;
    }

    function handleClick(event) {
        event.preventDefault();
        setLoading(true);
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;

        postData.set("title", title);
        postData.set("photo", image);
        postData.set("body", body);

        if (isValid()) {
            create(userId, token, postData).then((data) => {
                if (data.error) {
                    setError(data.error);
                    setLoading(false);
                } else {
                    setLoading(false);
                    setTitle("");
                    setBody("");
                    setImage("");
                    setRedirectToProfile(true);
                }
            });
        } else {
            setLoading(false);
        }
    }

    function newPostForm() {
        return (
            <form>
                <div className="form-group">
                    <label className="text-muted">Post Pic</label>
                    <input
                        name="photo"
                        onChange={handleChange}
                        type="file"
                        accept="image/*"
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label className="text-muted">Title</label>
                    <input
                        name="title"
                        onChange={handleChange}
                        value={title}
                        type="text"
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label className="text-muted">Body</label>
                    <textarea
                        name="body"
                        onChange={handleChange}
                        value={body}
                        type="text"
                        className="form-control"
                    />
                </div>

                <button
                    onClick={handleClick}
                    className="btn btn-primary btn-raised"
                >
                    Create Post
                </button>
            </form>
        );
    }

    if (redirectToProfile) {
        return <Redirect to="/" />;
    }

    return (
        <div className="container">
            <h2 className="mt-5 mb-5">Create A New Post</h2>
            <div
                className="alert alert-danger"
                style={{ display: !error ? "none" : null }}
            >
                {error}
            </div>
            {loading && (
                <div className="jumbotron text-center">
                    <h2>Loading...</h2>
                </div>
            )}

            {newPostForm()}
        </div>
    );
}

export default NewPost;
