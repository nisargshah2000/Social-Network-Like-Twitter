import React from "react";
import { Link } from "react-router-dom";
import DefaultProfileImage from "../images/avatar.jpg";
import DefaultPostImage from "../images/twitter.jpg"

function ProfileTabs(props) {

    const { followers, following, posts } = props;

    return <div>
        <div className="row">
            <div className="col-md-4">
                <h3 className="text-primary">Followers</h3>
                <hr />
                {followers.map((person, i) => {
                    return <div key={i}>
                        <div>
                            <Link to={`/user/${person._id}`} style={{ textDecoration: "none" }} >
                                <img className="float-left mr-2" height="30px" width="30px"
                                    style={{ borderRadius: "50%" }}
                                    src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}?${new Date().getTime()}`}
                                    onError={i => (i.target.src = `${DefaultProfileImage}`)} alt={person.name}
                                />
                                <p className="lead" style={{ textDecoration: "none" }}>{person.name}</p>
                            </Link>
                        </div>
                    </div>
                })}
            </div>

            <div className="col-md-4">
                <h3 className="text-primary">Following</h3>
                <hr />
                {following.map((person, i) => {
                    return <div key={i}>
                        <div>
                            <Link to={`/user/${person._id}`} style={{ textDecoration: "none" }}>
                                <img className="float-left mr-2" height="30px" width="30px"
                                    style={{ borderRadius: "50%" }}
                                    src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}?${new Date().getTime()}`}
                                    onError={i => (i.target.src = `${DefaultProfileImage}`)} alt={person.name}
                                />
                                <p className="lead">  {person.name}</p>
                            </Link>
                        </div>
                    </div>
                })}
            </div>

            <div className="col-md-4">
                <h3 className="text-primary">Posts</h3>
                <hr />
                {posts.map((post, i) => {
                    return <div key={i}>
                        <div>
                            <Link to={`/posts/${post._id}`} style={{ textDecoration: "none" }}>
                                <img className="float-left mr-2" height="30px" width="30px"
                                    style={{ borderRadius: "50%" }}
                                    src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}?${new Date().getTime()}`}
                                    onError={i => (i.target.src = `${DefaultPostImage}`)} alt={post.title}
                                />
                                <p className="lead">  {post.title}</p>
                            </Link>
                        </div>
                    </div>
                })}
            </div>
        </div>
    </div>
};

export default ProfileTabs;