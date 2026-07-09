import React, { useState, useEffect } from "react";

const Workouts = ({ setCurrentPage }) => {
    const [workoutName, setWorkoutName] = useState("");
    const [workoutType, setWorkoutType] = useState("");
    const [muscleGroup, setMuscleGroup] = useState("");
    const [date, setDate] = useState("");
    const [notes, setNotes] = useState("");

    const [workouts, setWorkouts] = useState([]);

     const fetchWorkouts = async () => {
        try {
            const response = await fetch("http://localhost:9000/workouts");
            const data = await response.json();
            setWorkouts(data);
        } catch (error) {
            console.error("Error fetching workouts:", error);
        }
    };

    useEffect(() => {fetchWorkouts();}, []);

    const handleSubmit = async (e) => {
    e.preventDefault();

    const newWorkout = {
        workoutName,
        workoutType,
        muscleGroup,
        date,
        notes,
    };

    try {
        const response = await fetch("http://localhost:9000/workouts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(newWorkout)
        });

        if (!response.ok) {
            throw new Error("Failed to create workout");
        }

        const data = await response.json();
        console.log("Workout created:", data);

        setWorkoutName("");
        setWorkoutType("");
        setMuscleGroup("");
        setDate("");
        setNotes("");

        fetchWorkouts();

    } catch (error) {
        console.error("Error creating workout:", error);
    }
    };

    return (
        <div>
            <button onClick={() => setCurrentPage("dashboard")}>
                Back to Dashboard
            </button>
            <h1>Workouts</h1>

            <section>
                <h2>Create a New Workout</h2>
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
                        Create Workout
                    </button>
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
                            </div>
                        </div>
                    ))
                )}
            </section>
        </div>
    );
};

export default Workouts;