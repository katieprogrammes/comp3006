import React from "react";
import WebSocketTest from "./WebSocketTest";

const Dashboard = ({ loggedInUser, handleLogout,setCurrentPage }) => {
    return (
        <div>
            <h1 className="title">Gym Workout Record System</h1>

            <h2 className="text-center">Welcome {loggedInUser}</h2>

            <button className="btn btn-info" onClick={() => setCurrentPage("workouts")}>
                Workouts
            </button>

            <button className="btn btn-info" onClick={() => setCurrentPage("leaderboard")}>
                Leaderboard
            </button>

            <button onClick={handleLogout} className="btn btn-danger">
                Logout
            </button>

            <WebSocketTest />
        </div>
    );
};

export default Dashboard;