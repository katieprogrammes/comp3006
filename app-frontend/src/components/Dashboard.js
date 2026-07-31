import React from "react";
//import WebSocketTest from "./WebSocketTest";

const Dashboard = ({ loggedInUser, handleLogout,setCurrentPage }) => {
    return (
        <div>
            <h1 className="title">Gym Workout Record System</h1>

            <h2 className="text-center mt-4">Welcome {loggedInUser?.name}</h2>

            <div className="dashgroup">
                <button className="btn btn-info btn-lg dash-button" onClick={() => setCurrentPage("workouts")}>
                    Workouts
                </button>

                <button className="btn btn-success btn-lg dash-button" onClick={() => setCurrentPage("leaderboard")}>
                    Leaderboard
                </button>
                

                <button className="btn btn-primary btn-lg dash-button" onClick={() => setCurrentPage("account")}>
                    My Account
                </button>
                
                <button onClick={handleLogout} className="btn btn-danger btn-lg dash-button">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;