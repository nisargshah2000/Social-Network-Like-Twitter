import React, { useState, useEffect } from "react";
import { singlePost, remove, unlike, like } from "./apiPost";
import DefaultPostImage from "../images/himalaya.jpg";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth/index";
import Comment from "./Comment";

function SinglePost(props) {
    const [post, setPost] = useState({ postedBy: {}, likes: [], comments: [] });
    const [loading, setLoading] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [isLike, setIsLike] = useState(true);
    const [likes, setLikes] = useState(0);
    const [redirectSignIn, setRedirectSignIn] = useState(false);

    useEffect(() => {
        const postId = props.match.params.postId;
        singlePost(postId).then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                setPost(data);
                checkLike(data.likes);
                setLikes(data.likes.length);
                setLoading(false);
            }
        });

        // eslint-disable-next-line
    }, [props.match.params.postId]);

    function checkLike(likes) {
        if (isAuthenticated().user) {
            const userId = isAuthenticated().user._id;
            setIsLike(likes.indexOf(userId) !== -1);
        }
    }

    function deletePost() {
        const token = isAuthenticated().token;
        const postId = props.match.params.postId;
        if (
            isAuthenticated().user &&
            isAuthenticated().user._id === post.postedBy._id
        ) {
            remove(postId, token).then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    setRedirect(true);
                }
            });
        } else {
            setRedirect(true);
        }
    }

    function confirmPrompt() {
        let ans = window.confirm("Are you sure about deleting this Post ?");
        if (ans) {
            deletePost();
        }
    }

    function toggleLike() {
        const callApi = isLike ? unlike : like;

        if (!isAuthenticated().user) {
            setRedirectSignIn(true);
        } else {
            const userId = isAuthenticated().user._id;
            const postId = post._id;
            const token = isAuthenticated().token;

            callApi(userId, token, postId).then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    setLikes(data.likes.length);
                    setIsLike(!isLike);
                }
            });
        }
    }

    function updateComments(comments) {
        setPost((prevPost) => ({
            ...prevPost,
            comments,
        }));
    }

    function renderPost() {
        return (
            <div className="col-md-12 mb-4">
                <h2 className="mt-5 mb-4 display-2">{post.title}</h2>
                <img
                    className="img-thumbnail mb-4"
                    style={{ height: "500px", width: "100%" }}
                    src={`${process.env.REACT_APP_API_URL}/post/photo/${
                        post._id
                    }?${new Date().getTime()}`}
                    onError={(i) => (i.target.src = `${DefaultPostImage}`)}
                    alt={post.title}
                />

                {isLike ? (
                    <h3 onClick={toggleLike}>
                        <i
                            className="fa fa-thumbs-up text-success bg-dark"
                            style={{ padding: "10px", borderRadius: "50%" }}
                        />{" "}
                        {likes} Likes
                    </h3>
                ) : (
                    <h3 onClick={toggleLike}>
                        <i
                            className="fa fa-thumbs-up text-warning bg-dark"
                            style={{ padding: "10px", borderRadius: "50%" }}
                        />{" "}
                        {likes} Likes
                    </h3>
                )}

                <p className="card-text mt-4 lead">{post.body}</p>
                <p className="font-italic mark mb-4 lead">
                    Posted By{" "}
                    <Link
                        style={{ textDecoration: "none" }}
                        to={`/user/${post.postedBy._id}`}
                    >
                        {post.postedBy.name}
                    </Link>{" "}
                    on {new Date(post.created).toDateString()}
                </p>
                <div className="d-inline-block">
                    <Link
                        to={`/`}
                        className="btn btn-primary btn-raised btn-sm mr-5 px-4"
                    >
                        Back to Posts
                    </Link>
                    {isAuthenticated().user &&
                        !(
                            isAuthenticated().user.role === "admin" &&
                            post.postedBy._id === isAuthenticated().user._id
                        ) &&
                        isAuthenticated().user.role === "admin" && (
                            <div class="card mt-5">
                                <div className="card-body">
                                    <h5 className="card-title">Admin</h5>
                                    <p className="mb-2 text-danger">
                                        Edit/Delete as an Admin
                                    </p>
                                    <Link
                                        to={`/post/edit/${post._id}`}
                                        className="btn btn-raised btn-success btn-sm mr-5"
                                    >
                                        Update Post
                                    </Link>
                                    <button
                                        onClick={confirmPrompt}
                                        className="btn btn-raised btn-danger"
                                    >
                                        Delete Post
                                    </button>
                                </div>
                            </div>
                        )}
                    {isAuthenticated().user &&
                        post.postedBy._id === isAuthenticated().user._id && (
                            <>
                                <Link
                                    className="btn btn-primary btn-raised btn-success btn-sm mr-5 px-4"
                                    to={`/post/edit/${post._id}`}
                                >
                                    Update Post
                                </Link>
                                <button
                                    className="btn btn-primary btn-raised btn-danger btn-sm px-4"
                                    onClick={confirmPrompt}
                                >
                                    Delete Post
                                </button>
                            </>
                        )}
                </div>
                <Comment
                    postId={post._id}
                    comments={post.comments}
                    updateComments={updateComments}
                />
            </div>
        );
    }

    if (redirect) {
        return <Redirect to="/" />;
    }

    if (redirectSignIn) {
        return <Redirect to="/signin" />;
    }

    return (
        <div className="container">
            {loading && (
                <div className="jumbotron text-center">
                    <h2>Loading...</h2>
                </div>
            )}
            {renderPost()}
        </div>
    );
}

export default SinglePost;
