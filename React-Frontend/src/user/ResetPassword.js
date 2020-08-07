import React, { useState } from "react";
import { resetPassword } from "../auth";
import { Redirect } from "react-router-dom";
 
function ResetPassword(props) {
    
    const [newPassword,setNewPassword] = useState("");
    const [message,setMessage] = useState("");
    const [error,setError] = useState("");
    const [redirect,setRedirect] = useState(false);
 
    const handleClick = e => {
        e.preventDefault();
        setMessage("");
        setNewPassword("");
        setError("")
 
        resetPassword({
            newPassword,
            resetPasswordLink: props.match.params.resetPasswordToken
        }).then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setMessage(data.message);
                setTimeout(()=>setRedirect(true),2000);
            }
        });
    };

    if(redirect){
        return <Redirect to="/signin" />
    }
 
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Reset your Password</h2>
 
                <div className="alert alert-success" style={{display:!message ?"none" : null}}>
                {message}
                </div> 
                <div className="alert alert-danger" style={{display:!error ?"none" : null}}>
                {error}
                </div> 
 
                <form>
                    <div className="form-group mt-5">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Your new password"
                            value={newPassword}
                            name="newPassword"
                            onChange={e =>{
                                    setNewPassword(e.target.value);
                                    setMessage("");
                                    setError("");
                                }
                            }
                            autoFocus
                        />
                    </div>
                    <button
                        onClick={handleClick}
                        className="btn btn-raised btn-primary"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        );
}
 
export default ResetPassword;