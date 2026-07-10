import React, { useState, useEffect } from "react";

const Exercises = ({ workout, setSelectedWorkout }) => {
    const [exerciseName, setExerciseName] = useState("");
    const [exerciseSets, setExerciseSets] = useState("");
    const [exerciseReps, setExerciseReps] = useState("");
    const [exerciseWeight, setExerciseWeight] = useState("");
    const [exerciseNotes, setExerciseNotes] = useState("");

    const [editingExerciseId, setEditingExerciseId] = useState(null);
    const [exercises, setExercises] = useState([]);

    const workoutId = workout?._id;

    const fetchExercises = async () => {
        if (!workoutId) return;
        try {
            const response = await fetch(`http://localhost:9000/exercises/workout/${workoutId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            const data = await response.json();
            setExercises(data);
        } catch (error) {
            console.error("Error fetching exercises:", error);
        }
    };

    useEffect(() => {
        fetchExercises();
    }, [workoutId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const exerciseData = {
            workoutId,
            exerciseName,
            sets: Number(exerciseSets),
            reps: Number(exerciseReps),
            weight: Number(exerciseWeight),
            notes: exerciseNotes,
        };

        try {
            const url = editingExerciseId
                ? `http://localhost:9000/exercises/${editingExerciseId}`
                : "http://localhost:9000/exercises";

            const method = editingExerciseId ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(exerciseData)
            });

            if (!response.ok) {
                throw new Error("Failed to save exercise");
            }

            setExerciseName("");
            setExerciseSets("");
            setExerciseReps("");
            setExerciseWeight("");
            setExerciseNotes("");
            setEditingExerciseId(null);

            fetchExercises();

        } catch (error) {
            console.error("Error saving exercise:", error);
        }
    };

    const handleEdit = (exercise) => {
        setExerciseName(exercise.exerciseName);
        setExerciseSets(exercise.sets);
        setExerciseReps(exercise.reps);
        setExerciseWeight(exercise.weight);
        setExerciseNotes(exercise.notes || "");
        setEditingExerciseId(exercise._id);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:9000/exercises/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to delete exercise");
            }

            fetchExercises();
        } catch (error) {
            console.error("Error deleting exercise:", error);
        }
    };

    if (!workoutId) {
    return (
        <div>
            <h1>Exercises</h1>
            <p>No workout selected.</p>

            {setSelectedWorkout && (
                <button
                    className="btn btn-secondary"
                    onClick={() => setSelectedWorkout(null)}
                >
                    Back to Workouts
                </button>
            )}
        </div>
    );
}

    return (
        <div>
            
            <button
                onClick={() => setSelectedWorkout(null)}
            >
                Back to Workouts
            </button>

            <h1>Exercises for {workout.workoutName}</h1>

            <section>
                <h2>{editingExerciseId ? "Edit Exercise" : "Create a New Exercise"}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="exerciseName" className="form-label">
                            Exercise Name:
                        </label>
                        <input
                            type="text"
                            id="exerciseName"
                            className="form-control"
                            value={exerciseName}
                            onChange={(e) => setExerciseName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="exerciseSets" className="form-label">
                            Sets:
                        </label>
                        <input
                            type="number"
                            id="exerciseSets"
                            className="form-control"
                            value={exerciseSets}
                            onChange={(e) => setExerciseSets(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="exerciseReps" className="form-label">
                            Reps:
                        </label>
                        <input
                            type="number"
                            id="exerciseReps"
                            className="form-control"
                            value={exerciseReps}
                            onChange={(e) => setExerciseReps(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="exerciseWeight" className="form-label">
                            Weight:
                        </label>
                        <input
                            type="number"
                            id="exerciseWeight"
                            className="form-control"
                            value={exerciseWeight}
                            onChange={(e) => setExerciseWeight(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="exerciseNotes" className="form-label">
                            Notes:
                        </label>
                        <textarea
                            id="exerciseNotes"
                            className="form-control"
                            value={exerciseNotes}
                            onChange={(e) => setExerciseNotes(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        {editingExerciseId ? "Update Exercise" : "Create Exercise"}
                    </button>

                    {editingExerciseId && (
                        <button
                            type="button"
                            className="btn btn-secondary ms-2"
                            onClick={() => {
                                setExerciseName("");
                                setExerciseSets("");
                                setExerciseReps("");
                                setExerciseWeight("");
                                setExerciseNotes("");
                                setEditingExerciseId(null);
                            }}
                        >
                            Cancel Edit
                        </button>
                    )}
                </form>
            </section>

            <section>
                <h2>Exercise List</h2>

                {exercises.length === 0 ? (
                    <p>No exercises found for this workout.</p>
                ) : (
                    exercises.map((exercise) => (
                        <div key={exercise._id} className="card mt-3">
                            <div className="card-body">
                                <h3>{exercise.exerciseName}</h3>
                                <p>Sets: {exercise.sets}</p>
                                <p>Reps: {exercise.reps}</p>
                                <p>Weight: {exercise.weight}</p>
                                <p>Notes: {exercise.notes}</p>

                                <div className="btn-group">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => handleEdit(exercise)}
                                    >
                                        Edit Exercise
                                    </button>

                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(exercise._id)}
                                    >
                                        Delete Exercise
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

export default Exercises;