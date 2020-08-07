import React from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth/index";

function isActive(history, path) {
    if (history.location.pathname === path) return { color: "#000000" };
    else return { color: "#ffffff" };
}

function Menu({ history }) {
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                {isAuthenticated() && (
                    <Link
                        className="navbar-brand"
                        to={`/user/${isAuthenticated().user._id}`}
                        style={isActive(
                            history,
                            `/user/${isAuthenticated().user._id}`
                        )}
                    >
                        {isAuthenticated().user.name}'s Profile
                    </Link>
                )}

                {!isAuthenticated() && (
                    <h2 className="navbar-brand" style={{ marginBottom: "0" }}>
                        Welcome
                    </h2>
                )}

                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="collapse navbar-collapse"
                    id="navbarSupportedContent"
                >
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link
                                style={isActive(history, "/")}
                                className="nav-link"
                                to="/"
                            >
                                Home
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                style={isActive(history, "/users")}
                                className="nav-link"
                                to="/users"
                            >
                                Users
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                style={isActive(history, "/post/create")}
                                className="nav-link"
                                to="/post/create"
                            >
                                Create Post
                            </Link>
                        </li>

                        {!isAuthenticated() && (
                            <>
                                <li className="nav-item">
                                    <Link
                                        style={isActive(history, "/signup")}
                                        className="nav-link"
                                        to="/signup"
                                    >
                                        Sign Up
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        style={isActive(history, "/signin")}
                                        className="nav-link"
                                        to="/signin"
                                    >
                                        Sign In
                                    </Link>
                                </li>
                            </>
                        )}

                        {isAuthenticated() && (
                            <>
                                <li className="nav-item">
                                    <Link
                                        style={isActive(history, "/findpeople")}
                                        className="nav-link"
                                        to="/findpeople"
                                    >
                                        Find People
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className="nav-link"
                                        href="/"
                                        onClick={() =>
                                            signout(() => history.push("/"))
                                        }
                                        style={{
                                            color: "#fff",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {" "}
                                        Sign Out
                                    </a>
                                </li>{" "}
                            </>
                        )}

                        {isAuthenticated().user &&
                            isAuthenticated().user.role === "admin" && (
                                <li className="nav-item">
                                    <Link
                                        style={isActive(history, "/admin")}
                                        className="nav-link"
                                        to="/admin"
                                    >
                                        Admin
                                    </Link>
                                </li>
                            )}
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default withRouter(Menu);
