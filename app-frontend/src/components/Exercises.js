import React, { useState, useEffect } from "react";

const Exercises = ({ workout, setSelectedWorkout }) => {
    const [exerciseName, setExerciseName] = useState("");
    const [exerciseSets, setExerciseSets] = useState("");
    const [exerciseReps, setExerciseReps] = useState("");
    const [exerciseWeight, setExerciseWeight] = useState("");
    const [exerciseNotes, setExerciseNotes] = useState("");
    const [exerciseDate, setExerciseDate] = useState("");
    const [editingExerciseId, setEditingExerciseId] = useState(null);
    const [showExerciseForm, setShowExerciseForm] = useState(false);
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
            date: exerciseDate,
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
            setExerciseDate("");
            setEditingExerciseId(null);
            setShowExerciseForm(false);

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
        setExerciseDate(exercise.date ? exercise.date.split("T")[0] : "");
        setEditingExerciseId(exercise._id);
        setShowExerciseForm(true);
        window.scrollTo({top: 0, behavior: "smooth"});
    };

    const handleRepeat = (exercise) => {
        setExerciseName(exercise.exerciseName);
        setExerciseSets(exercise.sets);
        setExerciseReps(exercise.reps);
        setExerciseWeight(exercise.weight);
        setExerciseNotes(exercise.notes || "");
        setExerciseDate(new Date().toISOString().split("T")[0]);
        setEditingExerciseId(null);
        setShowExerciseForm(true);
        window.scrollTo({top: 0, behavior: "smooth"});
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
        <div className="page-container">
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
        <div className="page-container">
            
            <button className="btn btn-secondary mt-2" onClick={() => setSelectedWorkout(null)}
            >
                Back to Workouts
            </button>

            <h1 className="text-center">Exercises for {workout.workoutName}</h1>
            <h4 className="text-center text-muted">
                {workout.workoutType} · {workout.muscleGroup}
            </h4>

            <div className="text-center mt-3">
                <button
                    className="btn btn-success btn-lg"
                    onClick={() =>
                        setShowExerciseForm(!showExerciseForm)
                    }
                >
                    {showExerciseForm
                        ? "Hide Exercise Form"
                        : "Add Exercise"}
                </button>
            </div>
            {showExerciseForm && (
                <section className="entry-form mt-4">
                    <h2 className="text-center">{editingExerciseId ? "Edit Exercise" : "Create a New Exercise"}</h2>

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
                            <label htmlFor="exerciseDate" className="form-label">
                                Date:
                            </label>

                            <input
                                type="date"
                                id="exerciseDate"
                                className="form-control"
                                value={exerciseDate}
                                onChange={(e) => setExerciseDate(e.target.value)}
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
                                    setExerciseDate("");
                                    setEditingExerciseId(null);
                                    setShowExerciseForm(false);
                                }}
                            >
                                Cancel Edit
                            </button>
                        )}
                    </form>
                </section>
            )}

            <section className="mt-4">
                <h2 className="text-center">Exercise List</h2>

                {exercises.length === 0 ? (
                    <p>No exercises found for this workout.</p>
                ) : (
                    <div className="row justify-content-center mt-3">
                        {exercises.map((exercise) => (
                            <div
                                key={exercise._id}
                                className="col-md-6 col-lg-4 mb-4"
                            >
                                <div className="card h-100">
                                    <div className="card-body d-flex flex-column">
                                        <h3 className="card-title text-center">
                                            {exercise.exerciseName}
                                        </h3>

                                        <p className="card-text">
                                            <strong>Sets:</strong> {exercise.sets}
                                        </p>

                                        <p className="card-text">
                                            <strong>Reps:</strong> {exercise.reps}
                                        </p>

                                        <p className="card-text">
                                            <strong>Weight:</strong>{" "}
                                            {exercise.weight} kg
                                        </p>

                                        <p className="card-text">
                                            <strong>Date:</strong>{" "}
                                            {exercise.date
                                                ? new Date(exercise.date).toLocaleDateString()
                                                : "No date recorded"}
                                        </p>

                                        {exercise.notes && (
                                            <p className="card-text">
                                                <strong>Notes:</strong>{" "}
                                                {exercise.notes}
                                            </p>
                                        )}

                                        <div className="mt-auto">
                                             <button
                                                className="btn btn-info me-2 mb-2"
                                                onClick={() => handleRepeat(exercise)}
                                            >
                                                Repeat
                                            </button>
                                            <button
                                                className="btn btn-secondary me-2 mb-2"
                                                onClick={() =>
                                                    handleEdit(exercise)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="btn btn-danger mb-2"
                                                onClick={() =>
                                                    handleDelete(exercise._id)
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

export default Exercises;