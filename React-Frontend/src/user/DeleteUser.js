import React, { useState } from "react";
import {isAuthenticated} from "../auth/index"
import {remove} from "./apiUser";
import {signout} from "../auth/index";
import { Redirect } from "react-router-dom";

function DeleteUser(props){

    const [redirect,setRedirect] = useState(false);

    function deleteAccount() {
        const token = isAuthenticated().token;
        const userId = props.userId;
        remove(userId,token)    
        .then(data => {
            if(data.error){
                console.log(data.error);
            }else{
                signout(() => true);
                setRedirect(true);
            }
        })
    };
    
    
    function confirmPrompt(){
        let ans = window.confirm("Are you sure about deleting your Account ?");
        if(ans){
            deleteAccount();
        }
    };

    if(redirect){
        return <Redirect to="/signup"/>
    }

    return  <button onClick={confirmPrompt} className="btn btn-raised btn-danger ">Delete Account</button>
};

export default DeleteUser;