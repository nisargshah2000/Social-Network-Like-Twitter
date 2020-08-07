import React, { useState } from "react";
import { comment, uncomment } from "./apiPost";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/index";
import DefaultProfileImage from "../images/avatar.jpg";

function Comment(props) {
    const [text, setText] = useState("");
    const [error, setError] = useState("");

    let comments = props.comments;

    function handleChange(event) {
        setError("");
        setText(event.target.value);
    }

    function isValid() {
        if (text.length === 0) {
            setError("Comment can't be Empty");
            return false;
        }

        if (text.length > 150) {
            setError("Comment must be less than 150 Characters");
            return false;
        }

        return true;
    }

    function addComment(event) {
        event.preventDefault();

        if (!isAuthenticated()) {
            setError("Please Sign In to Leave a Comment");
            return;
        }

        if (isValid()) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            const postId = props.postId;
            const commentObject = { text: text };
            comment(userId, token, postId, commentObject).then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    setText("");
                    props.updateComments(data.comments);
                }
            });
        }
    }

    function deleteComment(comment) {
        if (!isAuthenticated()) {
            setError("Please Sign In to Leave a Comment");
            return;
        }

        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        const postId = props.postId;

        uncomment(userId, token, postId, comment).then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                props.updateComments(data.comments);
            }
        });
    }

    function confirmPrompt(comment) {
        let ans = window.confirm("Are you sure about deleting this Comment ?");
        if (ans) {
            deleteComment(comment);
        }
    }

    return (
        <div>
            <h2 className="mt-5">Leave a Comment</h2>
            <div
                className="mt-4 alert alert-danger"
                style={{ display: !error ? "none" : null }}
            >
                {error}
            </div>

            <form onSubmit={addComment} className="mt-4">
                <div className="form-group">
                    <input
                        type="text"
                        value={text}
                        className="form-control"
                        onChange={handleChange}
                        placeholder="Leave a Comment..."
                    />
                    <button
                        type="submit"
                        className="btn btn-raised btn-success mt-4"
                    >
                        Post
                    </button>
                </div>
            </form>

            <div>
                <h3 className="text-primary">
                    {comments.length === 0 ? "No" : comments.length} Comments
                </h3>
                <hr />
                {comments
                    .slice(0)
                    .reverse()
                    .map((comment, i) => {
                        return (
                            <div key={i}>
                                <div>
                                    <Link
                                        to={`/user/${comment.postedBy._id}`}
                                        style={{ textDecoration: "none" }}
                                    >
                                        <img
                                            className="float-left mr-2"
                                            height="30px"
                                            width="30px"
                                            style={{ borderRadius: "50%" }}
                                            src={`${
                                                process.env.REACT_APP_API_URL
                                                }/user/photo/${
                                                comment.postedBy._id
                                                }?${new Date().getTime()}`}
                                            onError={(i) =>
                                                (i.target.src = `${DefaultProfileImage}`)
                                            }
                                            alt={comment.postedBy.name}
                                        />
                                    </Link>
                                    <p className="lead"> {comment.text}</p>
                                    <p className="font-italic mark mb-4 lead">
                                        Commented By{" "}
                                        <Link
                                            style={{ textDecoration: "none" }}
                                            to={`/user/${comment.postedBy._id}`}
                                        >
                                            {comment.postedBy.name}
                                        </Link>{" "}
                                        on{" "}
                                        {new Date(
                                            comment.created
                                        ).toDateString()}
                                        <span>
                                            {((isAuthenticated().user &&
                                                comment.postedBy._id ===
                                                isAuthenticated().user
                                                    ._id) || (isAuthenticated().user &&
                                                        isAuthenticated().user.role === "admin"))
                                                && (
                                                    <span
                                                        className="text-danger float-right mr-4"
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() =>
                                                            confirmPrompt(comment)
                                                        }
                                                    >
                                                        Delete
                                                    </span>
                                                )}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        );
                    })}

                <br />
                <br />
                <br />
                <br />
            </div>
        </div>
    );
}

export default Comment;
