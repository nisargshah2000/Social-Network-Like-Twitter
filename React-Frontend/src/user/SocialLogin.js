import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import GoogleLogin from "react-google-login";
import { socialLogin, authenticate } from "../auth";

function SocialLogin() {
    const [redirectToReferrer, setRedirectToReferrer] = useState(false);

    const responseGoogle = (response) => {
        const tokenId = response.tokenId;
        const user = {
            tokenId: tokenId,
        };

        socialLogin(user).then((data) => {
            if (data.error) {
                console.log("Error Login. Please try again..");
            } else {
                authenticate(data, () => {
                    setRedirectToReferrer(true);
                });
            }
        });
    };

    // redirect
    if (redirectToReferrer) {
        return <Redirect to="/" />;
    }

    return (
        <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            buttonText="Login with Google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
        />
    );
}

export default SocialLogin;
