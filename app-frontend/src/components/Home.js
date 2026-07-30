import React from "react";

const Home = ({ setCurrentPage }) => {
    return (
        <div className="container mt-5 text-center">
            <h1>Gym Workout Record System</h1>

            <p className="lead">
                Record workouts, track exercises and compare your weekly lifts.
            </p>

            <div className="mt-4">
                <button className="btn btn-primary me-3" onClick={() => setCurrentPage("login")}>
                    Login
                </button>

                <button className="btn btn-primary me-3" onClick={() => setCurrentPage("register")}>
                    Register
                </button>
            </div>
        </div>
    );
};

export default Home;