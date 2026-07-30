import React from "react";

const Home = ({ setCurrentPage }) => {
    return (
        <div className="container mt-5 text-center">
            <h1>Gym Workout Record System</h1>

            <h2 className="mt-4">
                Record workouts, track exercises and compare your weekly lifts.
            </h2>

            <div className="mt-4">
                <button className="btn btn-primary btn-lg mx-4" onClick={() => setCurrentPage("login")}>
                    Login
                </button>

                <button className="btn btn-outline-primary btn-lg mx-4" onClick={() => setCurrentPage("register")}>
                    Register
                </button>
            </div>
        </div>
    );
};

export default Home;