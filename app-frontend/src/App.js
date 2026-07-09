import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Workouts from './components/Workouts';

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