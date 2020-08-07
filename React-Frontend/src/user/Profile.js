import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth/index";
import { Redirect, Link } from "react-router-dom";
import DefaultProfileImage from "../images/avatar.jpg";
import { read } from "./apiUser";
import DeleteUser from "./DeleteUser";
import FollowProfileButton from "./FollowProfileButton";
import ProfileTabs from "./ProfileTabs";
import { listByUser } from "../post/apiPost";

function Profile(props) {
    const [user, setUser] = useState("");
    const [redirectToSignin, setRedirectToSignin] = useState(false);
    const [loadedPhoto, setLoadedPhoto] = useState(false);
    const [following, setFollowing] = useState(false);
    const [error, setError] = useState("");
    const [followersList, setFollowersList] = useState([]);
    const [followingList, setFollowingList] = useState([]);
    const [posts, setPosts] = useState([]);

    function init(userId) {
        const token = isAuthenticated().token;
        read(userId, token).then((data) => {
            if (data.error) {
                setRedirectToSignin(true);
            } else {
                setUser(data);
                setFollowersList(data.followers);
                setFollowingList(data.following);
                setLoadedPhoto(true);
                checkFollow(data);
            }
        });

        listByUser(userId, token).then((data) => {
            if (data.error) {
                setRedirectToSignin(true);
            } else {
                setPosts(data);
            }
        });
    }

    function checkFollow(user) {
        const jwt = isAuthenticated();

        const match = user.followers.find((follower) => {
            return follower._id === jwt.user._id;
        });

        if (match) {
            setFollowing(true);
        }
    }

    function clickFollow(callApi) {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        const anotherId = user._id;
        callApi(userId, token, anotherId).then((data) => {
            if (data.error) {
                setError(data.error);
            } else {
                setFollowing(!following);
                setFollowersList(data.followers);
                setFollowingList(data.following);
            }
        });
    }

    useEffect(() => {
        const userId = props.match.params.userId;
        init(userId);

        // eslint-disable-next-line
    }, [props.match.params.userId]);

    if (redirectToSignin) {
        return <Redirect to="/signin" />;
    }

    return (
        <div className="container">
            <h2 className="mt-5 mb-3" style={{ fontSize: "40px" }}>
                Profile
            </h2>
            <div className="row">
                <div className="col-md-4">
                    {loadedPhoto && (
                        <img
                            className="img-thumbnail mb-1"
                            style={{
                                height: "300px",
                                width: "auto",
                                margin: "40px auto auto auto",
                            }}
                            src={`${process.env.REACT_APP_API_URL}/user/photo/${
                                user._id
                            }?${new Date().getTime()}`}
                            onError={(i) =>
                                (i.target.src = `${DefaultProfileImage}`)
                            }
                            alt={user.name}
                        />
                    )}
                </div>

                <div className="col-md-8" style={{ margin: "auto" }}>
                    <div className="lead mt-5" style={{ fontSize: "20px" }}>
                        <p>Name : {user.name}</p>
                        <p>Email : {user.email}</p>
                        <p>{`Joined On : ${new Date(
                            user.created
                        ).toDateString()}`}</p>
                    </div>

                    {isAuthenticated().user &&
                    isAuthenticated().user._id === user._id ? (
                        <div className="d-inline-block mt-3">
                            <Link
                                className="btn btn-raised btn-info mr-4"
                                to={`/post/create`}
                            >
                                Create Post
                            </Link>
                            <Link
                                className="btn btn-raised btn-success mr-4 "
                                to={`/user/edit/${user._id}`}
                            >
                                Edit Profile
                            </Link>
                            <DeleteUser userId={user._id} />
                        </div>
                    ) : (
                        <FollowProfileButton
                            isFollow={following}
                            onButtonClick={clickFollow}
                        />
                    )}

                    {isAuthenticated().user &&
                        !(
                            isAuthenticated().user.role === "admin" &&
                            user._id === isAuthenticated().user._id
                        ) &&
                        isAuthenticated().user.role === "admin" && (
                            <div class="card mt-5">
                                <div className="card-body">
                                    <h5 className="card-title">Admin</h5>
                                    <p className="mb-3 text-danger">
                                        Edit/Delete as an Admin
                                    </p>
                                    <Link
                                        className="btn btn-raised btn-success mr-5"
                                        to={`/user/edit/${user._id}`}
                                    >
                                        Edit Profile
                                    </Link>
                                    <DeleteUser userId={user._id} />
                                </div>
                            </div>
                        )}
                </div>
            </div>

            <div className="row">
                <div className="col-md-12 mt-5 mb-5">
                    {user.about && (
                        <>
                            <hr />
                            <p className="lead">{user.about}</p>
                        </>
                    )}
                    <hr />
                    <ProfileTabs
                        followers={followersList}
                        following={followingList}
                        posts={posts}
                    />
                </div>
            </div>
        </div>
    );
}

export default Profile;
