import React, { useState,useEffect } from "react";
import {list} from "./apiUser";
import DefaultProfileImage from "../images/avatar.jpg"
import {Link} from "react-router-dom";

function Users(){

    const [users,setUsers] = useState([]);

    function getUsers(){
        list().then(data => {
            if(data.error){
                console.log(data.error);
            }else{
                setUsers(data);
            }
        });
    }

    useEffect(() => {
        getUsers();
    }, []); 


    function renderUsers(){
        return <div className="row" >
            {users.map((user,i) => {
                return <div className="col-md-4 mb-4" key={i} >
                <div className="card">
                <img className="img-thumbnail mb-1" style={{height:"300px",width:"auto",margin:"40px auto auto auto"}} src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}`} 
                    onError={i => (i.target.src = `${DefaultProfileImage}`)}
                    alt={user.name}/>
                <div className="card-body">
                    <h5 className="card-title">{user.name}</h5>
                    <p className="card-text">{user.email}</p>
                    <Link to={`/user/${user._id}`} className="btn btn-primary btn-raised btn-sm">View Profile</Link>
                </div>
                </div>
                </div>
            })}
        </div>
    };

    return <div className="container">
        <h2 className="mt-5 mb-5">Users</h2>
        {renderUsers()}
    </div>
}

export default Users;

