import React from "react";
import Posts from "../post/Posts";

function Home() {
    return (
        <div>
            <div className="jumbotron">
                <h2>Home</h2>
                <p className="lead">Welcome to Nisarg's Twitter</p>
            </div>
            <div className="container-fluid">
                <Posts />
            </div>
        </div>
    );
}

export default Home;
