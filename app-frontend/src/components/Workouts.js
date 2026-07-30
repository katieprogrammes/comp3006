import React, { useState, useEffect } from "react";
import Exercises from "./Exercises";

const Workouts = ({ setCurrentPage, handleLogout }) => {
    const [workoutName, setWorkoutName] = useState("");
    const [workoutType, setWorkoutType] = useState("");
    const [muscleGroup, setMuscleGroup] = useState("");
    const [date, setDate] = useState("");
    const [notes, setNotes] = useState("");
    const [editingWorkoutId, setEditingWorkoutId] = useState(null);

    const [selectedWorkout, setSelectedWorkout] = useState(null);

    const [workouts, setWorkouts] = useState([]);

     const fetchWorkouts = async () => {
        try {
            const response = await fetch("http://localhost:9000/workouts", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.status === 401) {
                handleLogout();
                return;
            }

            const data = await response.json();
            setWorkouts(data);
        } catch (error) {
            console.error("Error fetching workouts:", error);
        }
    };

    useEffect(() => {fetchWorkouts();}, []);

    const handleSubmit = async (e) => {
    e.preventDefault();

    const workoutData = {
        workoutName,
        workoutType,
        muscleGroup,
        date,
        notes,
    };

    try {
        const url = editingWorkoutId
            ? `http://localhost:9000/workouts/${editingWorkoutId}`
            : "http://localhost:9000/workouts";

        const method = editingWorkoutId ? "PUT" : "POST";

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(workoutData)
        });

        if (!response.ok) {
            throw new Error("Failed to save workout");
        }

        setWorkoutName("");
        setWorkoutType("");
        setMuscleGroup("");
        setDate("");
        setNotes("");
        setEditingWorkoutId(null);

        fetchWorkouts();

    } catch (error) {
        console.error("Error saving workout:", error);
    }
};
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this workout?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:9000/workouts/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to delete workout");
            }

            fetchWorkouts();
        } catch (error) {
            console.error("Error deleting workout:", error);
        }
    };

    const handleEdit = (workout) => {
        setEditingWorkoutId(workout._id);
        setWorkoutName(workout.workoutName);
        setWorkoutType(workout.workoutType);
        setMuscleGroup(workout.muscleGroup);
        setDate(workout.date.split("T")[0]);
        setNotes(workout.notes || "");
    };

    if (selectedWorkout) {
    return (
        <Exercises
            workout={selectedWorkout}
            setSelectedWorkout={setSelectedWorkout}
        />
    );
}

    return (
        <div>
            <button onClick={() => setCurrentPage("dashboard")}>
                Back to Dashboard
            </button>
            <h1>Workouts</h1>

            <section>
                <h2>{editingWorkoutId ? "Edit Workout" : "Create a New Workout"}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="workoutName" className="form-label">Workout Name:</label>
                        <input className="form-control"
                            type="text"
                            id="workoutName"
                            value={workoutName}
                            onChange={(e) => setWorkoutName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="workoutType" className="form-label">Workout Type:</label>
                        <select className="form-select"
                            id="workoutType"
                            value={workoutType}
                            onChange={(e) => setWorkoutType(e.target.value)}
                            required
                        >
                            <option value="">Select a type</option>
                            <option value="Strength">Strength</option>
                            <option value="Cardio">Cardio</option>
                            <option value="Flexibility">Flexibility</option>
                            <option value="Mixed">Mixed</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="muscleGroup" className="form-label">Muscle Group:</label>
                        <input className="form-control"
                            type="text"
                            id="muscleGroup"
                            value={muscleGroup}
                            onChange={(e) => setMuscleGroup(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="date" className="form-label">Date:</label>
                        <input className="form-control"
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="notes" className="form-label">Notes:</label>
                        <textarea
                            className="form-control"
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        {editingWorkoutId ? "Update Workout" : "Create Workout"}
                    </button>
                    {editingWorkoutId && (
                    <button
                        type="button"
                        className="btn btn-secondary ms-2"
                        onClick={() => {
                            setWorkoutName("");
                            setWorkoutType("");
                            setMuscleGroup("");
                            setDate("");
                            setNotes("");
                            setEditingWorkoutId(null);
                        }}
                    >
                        Cancel Edit
                    </button>
                    )}
                </form>
            </section>
            <section className="mt-4">
                <h2>My Workouts</h2>

                {workouts.length === 0 ? (
                    <p>No workouts found.</p>
                ) : (
                    <div className="row">
                        {workouts.map((workout) => (
                            <div key={workout._id} className="col-md-6 col-lg-4 mb-4">
                                <div className="card h-100">
                                    <div className="card-body d-flex flex-column">
                                        <h3 className="card-title">
                                            {workout.workoutName}
                                        </h3>

                                        <p className="card-text">
                                            <strong>Type:</strong>{" "}
                                            {workout.workoutType}
                                        </p>

                                        <p className="card-text">
                                            <strong>Muscle group:</strong>{" "}
                                            {workout.muscleGroup}
                                        </p>

                                        <p className="card-text">
                                            <strong>Date:</strong>{" "}
                                            {new Date(
                                                workout.date
                                            ).toLocaleDateString()}
                                        </p>

                                        {workout.notes && (
                                            <p className="card-text">
                                                <strong>Notes:</strong>{" "}
                                                {workout.notes}
                                            </p>
                                        )}

                                        <div className="mt-auto">
                                            <button
                                                className="btn btn-primary me-2 mb-2"
                                                onClick={() =>
                                                    setSelectedWorkout(workout)
                                                }
                                            >
                                                Manage Exercises
                                            </button>

                                            <button
                                                className="btn btn-secondary me-2 mb-2"
                                                onClick={() =>
                                                    handleEdit(workout)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="btn btn-danger mb-2"
                                                onClick={() =>
                                                    handleDelete(workout._id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Workouts;