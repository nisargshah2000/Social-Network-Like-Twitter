import React, { useEffect, useState } from "react";
import { singlePost, update } from "./apiPost";
import { isAuthenticated } from "../auth/index";
import DefaultPostImage from "../images/twitter.jpg";
import { Redirect } from "react-router-dom";

function EditPost(props) {
    const [post, setPost] = useState({
        _id: "",
        title: "",
        body: "",
    });

    let postData = new FormData();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadedPhoto, setLoadedPhoto] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [imageSize, setImageSize] = useState(0);
    const [image, setImage] = useState("");

    useEffect(() => {
        const postId = props.match.params.postId;
        singlePost(postId).then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                setPost(data);
                setLoading(false);
                setLoadedPhoto(true);
            }
        });

        // eslint-disable-next-line
    }, [props.match.params.postId]);

    function isValid() {
        if (post.title.length === 0) {
            setError("Title is Required");
            return false;
        }

        if (imageSize > 1024 * 1024) {
            setError("File size should be less than 1 MB");
            return false;
        }

        if (post.title.length < 4 || post.title.length > 150) {
            setError("Name must be 4 to 150 Characters Long");
            return false;
        }

        if (post.body.length < 4 || post.body.length > 2000) {
            setError("Name must be 4 to 2000 Characters Long");
            return false;
        }

        return true;
    }

    function handleChange(event) {
        setError("");

        if (event.target.name === "photo") {
            if (event.target.files[0]) {
                setImage(event.target.files[0]);
                setImageSize(event.target.files[0].size);
            } else {
                setImageSize(0);
                setImage("");
            }

            return;
        }

        const name = event.target.name;
        const value =
            name === "photo" ? event.target.files[0] : event.target.value;

        setPost((prevPost) => {
            return {
                ...prevPost,
                [name]: value,
            };
        });
    }

    function handleClick(event) {
        event.preventDefault();
        setLoading(true);
        const postId = props.match.params.postId;
        const token = isAuthenticated().token;

        postData.set("title", post.title);
        postData.set("body", post.body);
        if (image !== "") postData.set("photo", image);

        if (isValid()) {
            update(postId, token, postData).then((data) => {
                if (data.error) {
                    setError(data.error);
                    setLoading(false);
                } else {
                    setLoading(false);
                    setRedirect(true);
                }
            });
        } else {
            setLoading(false);
        }
    }

    function editPostForm() {
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
                        value={post.title}
                        type="text"
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label className="text-muted">Body</label>
                    <textarea
                        name="body"
                        onChange={handleChange}
                        value={post.body}
                        type="text"
                        className="form-control"
                    />
                </div>

                <button
                    onClick={handleClick}
                    className="btn btn-primary btn-raised"
                >
                    UPDATE
                </button>
            </form>
        );
    }

    if (redirect) {
        return <Redirect to={`/posts/${post._id}`} />;
    }

    return (
        <div className="container">
            <h2 className="mt-5 mb-5">{post.title}</h2>
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
            {loadedPhoto && (
                <img
                    className="img-thumbnail mb-1"
                    style={{ height: "200px", width: "auto" }}
                    src={`${process.env.REACT_APP_API_URL}/post/photo/${
                        post._id
                        }?${new Date().getTime()}`}
                    onError={(i) => (i.target.src = `${DefaultPostImage}`)}
                    alt={post.title}
                />
            )}
            {editPostForm()}
        </div>
    );
}

export default EditPost;
