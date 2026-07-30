import React, { useEffect, useState } from 'react';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Workouts from './components/Workouts';
import Leaderboard from './components/Leaderboard';
import MyAccount from './components/MyAccount';

function App() {
    const [loggedInUser, setLoggedInUser] = useState(() => {
        const savedUser = localStorage.getItem('user');

        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            localStorage.removeItem('user');
            return null;
        }
    });

    const [currentPage, setCurrentPage] = useState(() => {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        return token && savedUser ? "dashboard" : "home";
    });

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setLoggedInUser(null);
        setCurrentPage("home");
    };

    useEffect(() => {
    const handleStorageChange = (event) => {
        if (event.key === "token" || event.key === "user") {
            const token = localStorage.getItem("token");
            const savedUser = localStorage.getItem("user");

            if (!token || !savedUser) {
                setLoggedInUser(null);
                setCurrentPage("login");
            }
        }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
        window.removeEventListener("storage", handleStorageChange);
    };
}, []);

    if (!loggedInUser) {
        if (currentPage === "login") {
            return (
                <Login
                    setLoggedInUser={setLoggedInUser}
                    setCurrentPage={setCurrentPage}
                />
            );
        }

         if (currentPage === "register") {
            return (
                <Register
                    setLoggedInUser={setLoggedInUser}
                    setCurrentPage={setCurrentPage}
                />
            );
        }

        return <Home setCurrentPage={setCurrentPage} />;
    }

    if (currentPage === "workouts") {
        return <Workouts 
            setCurrentPage={setCurrentPage} 
            handleLogout={handleLogout}/>;
    }

    if (currentPage === "leaderboard") {
        return <Leaderboard 
            setCurrentPage={setCurrentPage} 
            handleLogout={handleLogout}/>;
    }

    if (currentPage === "account") {
        return (
            <MyAccount
                setCurrentPage={setCurrentPage}
                setLoggedInUser={setLoggedInUser}
                handleLogout={handleLogout}
            />
        );
    }
    return (
        <Dashboard
            loggedInUser={loggedInUser}
            setCurrentPage={setCurrentPage}
            handleLogout={handleLogout}
        />
    );
}

export default App;