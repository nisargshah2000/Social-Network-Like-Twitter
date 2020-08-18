import React, { useState, useEffect } from "react";
import { list } from "./apiPost";
import DefaultPostImage from "../images/twitter.jpg";
import { Link } from "react-router-dom";

function Posts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    function getPosts(page) {
        list(page).then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                setPosts(data);
                setLoading(false);
            }
        });
    }

    function loadMore(number) {
        getPosts(page + number);
        setPage(page + number);
    }

    function loadLess(number) {
        getPosts(page - number);
        setPage(page - number);
    }

    useEffect(() => {
        getPosts(page);
    }, []);

    function renderPosts() {
        return (
            <div className="row">
                {posts.map((post, i) => {
                    const posterId = post.postedBy._id;
                    const posterName = post.postedBy.name;
                    let postContent = post.body;
                    if (postContent.length >= 100) {
                        postContent = post.body.substring(0, 100) + " ...";
                    }

                    return (
                        <div className="col-md-4 d-flex mb-4" key={i}>
                            <div className="card">
                                <img
                                    className="img-thumbnail mb-1"
                                    style={{
                                        height: "200px",
                                        width: "auto",
                                        margin: "auto auto auto auto",
                                    }}
                                    src={`${
                                        process.env.REACT_APP_API_URL
                                        }/post/photo/${
                                        post._id
                                        }?${new Date().getTime()}`}
                                    onError={(i) =>
                                        (i.target.src = `${DefaultPostImage}`)
                                    }
                                    alt={post.title}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{post.title}</h5>
                                    <p className="card-text">{postContent}</p>
                                    {
                                        <p className="font-italic mark">
                                            Posted By{" "}
                                            <Link
                                                style={{
                                                    textDecoration: "none",
                                                }}
                                                to={`/user/${posterId}`}
                                            >
                                                {posterName}
                                            </Link>{" "}
                                            on{" "}
                                            {new Date(
                                                post.created
                                            ).toDateString()}
                                        </p>
                                    }
                                    <Link
                                        to={`/posts/${post._id}`}
                                        className="btn btn-primary btn-raised btn-sm"
                                    >
                                        Read More
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="container">
            <h2 className="mt-5 mb-5">
                {loading
                    ? "Loading..."
                    : !posts.length
                        ? "No more posts!"
                        : "Recent Posts"}
            </h2>
            {renderPosts()}
            {page > 1 ? (
                <button
                    className="btn btn-raised btn-warning mr-5 mt-3 mb-5"
                    onClick={() => loadLess(1)}
                >
                    Previous
                </button>
            ) : (
                    ""
                )}

            {posts.length ? (
                <button
                    className="btn btn-raised btn-success mt-3 mb-5"
                    onClick={() => loadMore(1)}
                >
                    Next
                </button>
            ) : (
                    ""
                )}
        </div>
    );
}

export default Posts;
