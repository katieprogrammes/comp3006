import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Workouts from './components/Workouts';
import Leaderboard from './components/Leaderboard';

const App = () => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [currentPage, setCurrentPage] = useState("dashboard");

    const handleLogout = () => {
        localStorage.removeItem('token');
        setLoggedInUser(null);
        setCurrentPage("dashboard");
    };

    const renderPage = () => {
        if (currentPage === "workouts") {
            return (
                <Workouts 
                    setCurrentPage={setCurrentPage}
                />
            );
        }
        if (currentPage === "leaderboard") {
            return (
                <Leaderboard
                    setCurrentPage={setCurrentPage}
                />
            );
        }

        return (
            <Dashboard 
                loggedInUser={loggedInUser}
                handleLogout={handleLogout}
                setCurrentPage={setCurrentPage}
            />
        );
    };

    return (
        <div className="App">
            {loggedInUser ? (
                renderPage()
            ) : (
                <div>
                    <Register />
                    <Login setLoggedInUser={setLoggedInUser} />
                </div>
            )}
        </div>
    );
};

export default App;