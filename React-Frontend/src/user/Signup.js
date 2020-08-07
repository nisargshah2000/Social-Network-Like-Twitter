import React, { useState } from "react";
import { signup } from "../auth/index";
import { Link } from "react-router-dom";

function Signup() {
    const [input, setInput] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [recaptcha, setRecaptcha] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;

        setInput((prevInput) => {
            return {
                ...prevInput,
                [name]: value,
            };
        });

        setError("");
    }

    function handleClick(event) {
        event.preventDefault();

        if (recaptcha) {
            signup(input).then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setInput((prevInput) => {
                        return {
                            name: "",
                            email: "",
                            password: "",
                        };
                    });

                    setSuccess(true);
                }
            });
        } else {
            setError("What day is today? Please write a correct answer!");
        }
    }

    const recaptchaHandler = (e) => {
        setError("");
        let userDay = e.target.value.toLowerCase();
        let dayCount;

        if (userDay === "sunday") {
            dayCount = 0;
        } else if (userDay === "monday") {
            dayCount = 1;
        } else if (userDay === "tuesday") {
            dayCount = 2;
        } else if (userDay === "wednesday") {
            dayCount = 3;
        } else if (userDay === "thursday") {
            dayCount = 4;
        } else if (userDay === "friday") {
            dayCount = 5;
        } else if (userDay === "saturday") {
            dayCount = 6;
        }

        if (dayCount === new Date().getDay()) {
            setRecaptcha(true);
            return true;
        } else {
            setRecaptcha(false);
            return false;
        }
    };

    function signupForm() {
        return (
            <form>
                <div className="form-group">
                    <label className="text-muted">Name</label>
                    <input
                        name="name"
                        onChange={handleChange}
                        value={input.name}
                        type="text"
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label className="text-muted">Email</label>
                    <input
                        name="email"
                        onChange={handleChange}
                        value={input.email}
                        type="email"
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label className="text-muted">Password</label>
                    <input
                        name="password"
                        onChange={handleChange}
                        value={input.password}
                        type="password"
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label className="text-muted">
                        {recaptcha
                            ? "Thanks. You got it!"
                            : "What day is today?"}
                    </label>

                    <input
                        onChange={recaptchaHandler}
                        type="text"
                        className="form-control"
                    />
                </div>
                <button
                    onClick={handleClick}
                    className="btn btn-primary btn-raised"
                >
                    Submit
                </button>
            </form>
        );
    }

    return (
        <div className="container">
            <h2 className="mt-5 mb-5">Signup</h2>

            <div
                className="alert alert-danger"
                style={{ display: !error ? "none" : null }}
            >
                {error}
            </div>

            <div
                className="alert alert-info"
                style={{ display: !success ? "none" : null }}
            >
                New Account is Successfully Created. Please
                <Link to="/signin" style={{ textDecoration: "none" }}>
                    {" "}
                    Sign In.
                </Link>
            </div>

            {signupForm()}
        </div>
    );
}

export default Signup;
