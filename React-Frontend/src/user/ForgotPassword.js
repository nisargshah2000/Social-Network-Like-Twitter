import React, { useState } from "react";
import { forgotPassword } from "../auth/index";
import { Redirect } from "react-router-dom";
 
function ForgotPassword() {

    const [email,setEmail] = useState("");
    const [message,setMessage] = useState("");
    const [error,setError] = useState("");
    const [redirect,setRedirect] = useState(false);
 
    const handleClick = e => {
        e.preventDefault();
        setMessage("");
        setError("");
        setEmail("");
        forgotPassword(email).then(data => {
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
            <h2 className="mt-5">Ask for Password Reset</h2>

            <div className="alert alert-success" style={{display:!message ?"none" : null}}>
            {message}
            </div> 
            <div className="alert alert-danger" style={{display:!error ?"none" : null}}>
            {error}
            </div> 

            { !redirect &&  (<form>
                <div className="form-group mt-2">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Your email address"
                        value={email}
                        name="email"
                        onChange={e => {
                                setEmail(e.target.value);
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
                    Send Password Rest Link
                </button>
            </form>)}
        </div>
    );

}
 
export default ForgotPassword;
