import React, { useEffect, useState } from "react";

const MyAccount = ({
    setCurrentPage,
    setLoggedInUser,
    handleLogout
}) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [workoutCount, setWorkoutCount] = useState(0);
    const [exerciseCount, setExerciseCount] = useState(0);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchAccount = async () => {
        try {
            const response = await fetch(
                "http://localhost:9000/users/account",
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        if (response.status === 401) {
                handleLogout();
                return;
            }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to load account");
        }

        setName(data.user.name);
        setEmail(data.user.email);
        setWorkoutCount(data.statistics.workoutCount);
        setExerciseCount(data.statistics.exerciseCount);
        } catch (error) {
            console.error("Error loading account:", error);
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccount();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await fetch(
                "http://localhost:9000/users/account",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({
                        name,
                        email
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to update account");
            }

            localStorage.setItem("user", JSON.stringify(data));
            setLoggedInUser(data);

            setMessage("Account updated successfully.");
        } catch (error) {
            console.error("Error updating account:", error);
            setMessage(error.message);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure? This will permanently delete your account, workouts and exercises."
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:9000/users/account",
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to delete account");
            }

            handleLogout();
        } catch (error) {
            console.error("Error deleting account:", error);
            setMessage(error.message);
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <p>Loading account...</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <button className="btn btn-secondary mb-3" onClick={() => setCurrentPage("dashboard")}>
                Back to Dashboard
            </button>

            <h1>My Account</h1>

            {message && (
                <div className="alert alert-info">
                    {message}
                </div>
            )}

            <div className="row">
                <div className="col-lg-8 mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <h2 className="card-title">Account Details</h2>

                            <form onSubmit={handleUpdate}>
                                <div className="mb-3">
                                    <label htmlFor="accountName" className="form-label">Name</label>
                                    <input id="accountName" type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="accountEmail" className="form-label">Email</label>
                                    <input id="accountEmail" type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>

                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4 mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <h2 className="card-title">Your Activity</h2>

                            <p className="fs-5">
                                <strong>Workouts:</strong> {workoutCount}
                            </p>

                            <p className="fs-5">
                                <strong>Exercises:</strong> {exerciseCount}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-danger mb-4">
                <div className="card-body">
                    <h2 className="card-title text-danger">
                        Delete Account
                    </h2>
                    <p>
                        Deleting your account permanently removes your workouts and exercises.
                    </p>
                    <button className="btn btn-danger" onClick={handleDelete}>Permanently Delete Account</button>
                </div>
            </div>
        </div>
    );
};

export default MyAccount;