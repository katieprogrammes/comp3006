import React, { useState, useEffect } from "react";
import Exercises from "./Exercises";

const Workouts = ({ setCurrentPage }) => {
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
            <section>
                <h2>My Workouts</h2>
                {workouts.length === 0 ? (
                    <p>No workouts found.</p>
                ) : (
                    workouts.map((workout) => (
                        <div key={workout._id} className="card mt-3">
                            <div className="card-body">
                                <h3>{workout.workoutName}</h3>
                                <p>Type: {workout.workoutType}</p>
                                <p>Muscle Group: {workout.muscleGroup}</p>
                                <p>
                                    Date:{" "}
                                    {new Date(workout.date).toLocaleDateString()}
                                </p>
                                <p>Notes: {workout.notes}</p>
                                <div className="btn-group">
                                    <button className="btn btn-info" onClick={() => setSelectedWorkout(workout)}>
                                        View Exercises
                                    </button>
                                    <button className="btn btn-secondary" onClick={() => handleEdit(workout)}>
                                        Edit Workout
                                    </button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(workout._id)}>
                                        Delete Workout
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </section>
        </div>
    );
};

export default Workouts;