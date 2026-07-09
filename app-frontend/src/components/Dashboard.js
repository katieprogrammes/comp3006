import React from "react";

const Dashboard = ({ loggedInUser, handleLogout }) => {
    return (
        <div>
            <h1>Gym Workout Record System</h1>

            <h2>Welcome {loggedInUser}</h2>

            <button>Create Workout</button>

            <button>View Workouts</button>

            <button>Exercise Library</button>

            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export default Dashboard;