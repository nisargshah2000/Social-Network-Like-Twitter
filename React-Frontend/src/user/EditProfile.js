import React, { useState, useEffect } from "react";
import { read, update } from "./apiUser";
import { isAuthenticated } from "../auth/index";
import DefaultProfileImage from "../images/avatar.jpg";
import { Redirect } from "react-router-dom";

function EditProfile(props) {
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [imageSize, setImageSize] = useState(0);
    const [id, setId] = useState("");
    const [about, setAbout] = useState("");
    const [loadedPhoto, setLoadedPhoto] = useState(false);
    const [loading, setLoading] = useState(false);

    const [redirectToProfile, setRedirectToProfile] = useState(false);
    const [error, setError] = useState("");

    let userData = new FormData();

    function init(userId) {
        const token = isAuthenticated().token;
        read(userId, token).then((data) => {
            if (data.error) {
                setRedirectToProfile(true);
            } else {
                setName(data.name);
                setId(data._id);
                setAbout(data.about);
                setLoadedPhoto(true);
            }
        });
    }

    useEffect(() => {
        const userId = props.match.params.userId;

        init(userId);
    }, [props.match.params.userId]);

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
        } else if (event.target.name === "name") {
            setName(event.target.value);
        } else if (event.target.name === "about") {
            setAbout(event.target.value);
        }
    }

    function isValid() {
        if (name.length === 0) {
            setError("Name is Required");
            return false;
        }

        if (imageSize > 1024 * 1024) {
            setError("File size should be less than 1 MB");
            return false;
        }

        if (name.length < 4 || name.length > 20) {
            setError("Name must be 4 to 20 Characters Long");
            return false;
        }

        return true;
    }

    function handleClick(event) {
        event.preventDefault();
        setLoading(true);
        const userId = props.match.params.userId;
        const token = isAuthenticated().token;

        userData.set("name", name);
        if (image !== "") userData.set("photo", image);
        userData.set("about", about);

        if (isValid()) {
            update(userId, token, userData).then((data) => {
                if (data.error) {
                    setError(data.error);
                    setLoading(false);
                } else {
                    if (
                        typeof window !== "undefined" &&
                        isAuthenticated().user._id === id
                    ) {
                        let auth = JSON.parse(localStorage.getItem("jwt"));
                        auth.user.name = name;
                        localStorage.setItem("jwt", JSON.stringify(auth));
                    }
                    setLoading(false);
                    setRedirectToProfile(true);
                }
            });
        } else {
            setLoading(false);
        }
    }

    function editProfileForm() {
        return (
            <form>
                <div className="form-group">
                    <label className="text-muted">Profile Pic</label>
                    <input
                        name="photo"
                        onChange={handleChange}
                        type="file"
                        accept="image/*"
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label className="text-muted">Name</label>
                    <input
                        name="name"
                        onChange={handleChange}
                        value={name}
                        type="text"
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label className="text-muted">About</label>
                    <textarea
                        name="about"
                        onChange={handleChange}
                        value={about}
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

    if (redirectToProfile) {
        return <Redirect to={`/user/${props.match.params.userId}`} />;
    }

    return (
        <div className="container">
            <h2 className="mt-5 mb-5">Edit Profile</h2>
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
                    src={`${
                        process.env.REACT_APP_API_URL
                    }/user/photo/${id}?${new Date().getTime()}`}
                    onError={(i) => (i.target.src = `${DefaultProfileImage}`)}
                    alt={name}
                />
            )}
            {editProfileForm()}
        </div>
    );
}

export default EditProfile;
