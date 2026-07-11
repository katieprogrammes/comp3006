import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const Leaderboard = ({ setCurrentPage }) => {
    const socketRef = useRef(null);

    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchLeaderboardData = async () => {
        try {
            setErrorMessage("");
            const response = await fetch("http://localhost:9000/exercises/leaderboard/weekly", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch leaderboard data");
            }
            const data = await response.json();
            setLeaderboardData(data);
        } catch (error) {
            console.error("Error fetching leaderboard data:", error);
            setErrorMessage("Could not load leaderboard.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboardData();

        socketRef.current = io("http://localhost:9000");

        socketRef.current.on("connect", () => {
            console.log("Connected to leaderboard socket:", socketRef.current.id);
        });

        socketRef.current.on("leaderboardUpdated", (updatedLeaderboard) => {
            console.log("Leaderboard updated:", updatedLeaderboard);

            if (Array.isArray(updatedLeaderboard)) {
                setLeaderboardData(updatedLeaderboard);
            } else {
                fetchLeaderboardData();
            }
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    return (
        <div className="container mt-4">
            <button className="btn btn-secondary mb-3" onClick={() => setCurrentPage("dashboard")}>
                Back to Dashboard
            </button>
            <h1>Weekly Heaviest Lift Leaderboard</h1>
            <p>
                This leaderboard shows the heaviest weight lifted by each user this week.
            </p>
            {loading && <p>Loading leaderboard...</p>}

            {errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}
            {!loading && leaderboardData.length === 0 && (
                <p>No leaderboard entries yet.</p>
            )}

        {!loading && leaderboardData.length > 0 && (
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>User</th>
                        <th>Exercise</th>
                        <th>Heaviest Weight</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboardData.map((entry, index) => (
                        <tr key={entry.userId || index}>
                            <td>{index + 1}</td>
                            <td>{entry.name}</td>
                            <td>{entry.exerciseName}</td>
                            <td>{entry.heaviestWeight} kg</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
    </div>
    );
};

export default Leaderboard;