import React from "react";
import {follow,unfollow} from "./apiUser";

function FollowProfileButton(props){

    function handleClick(){
        props.onButtonClick(props.isFollow ? unfollow : follow);
    }


    return <div className="d-inline-block mt-2">
        {!props.isFollow ? <button className="btn btn-success btn-raised px-4" onClick={handleClick}>Follow</button>
        :<button className="btn btn-warning btn-raised px-4" onClick={handleClick}>UnFollow</button>}
    </div>
};

export default FollowProfileButton;