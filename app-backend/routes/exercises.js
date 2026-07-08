import express from "express";
import User from "../models/User.js";
import Workout from "../models/Workout.js";
import Exercise from "../models/Exercise.js";

const router = express.Router();

//Get all exercises
router.get("/", async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ error: "Error fetching exercises" });
  }
});

//Get an exercise by ID
router.get("/:id", async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);
        if (!exercise) {
            return res.status(404).json({ error: "Exercise not found" });
        }
        res.json(exercise);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Create exercises
router.post("/", async (req, res) => {
    try {
        const { userId, workoutId, sets, reps, weight, date, notes } = req.body;
        const newExercise = new Exercise({ userId, workoutId, sets, reps, weight, date, notes });
        await newExercise.save();
        res.status(201).json(newExercise);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Update an exercise by ID
router.put("/:id", async (req, res) => {
    try {
        const { userId, workoutId, sets, reps, weight, date, notes } = req.body;
        const exercise = await Exercise.findByIdAndUpdate(req.params.id, { userId, workoutId, sets, reps, weight, date, notes }, { new: true });
        if (!exercise) {
            return res.status(404).json({ error: "Exercise not found" });
        }
        res.json(exercise);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Delete an exercise by ID
router.delete("/:id", async (req, res) => {
    try {
        const exercise = await Exercise.findByIdAndDelete(req.params.id);
        if (!exercise) {
            return res.status(404).json({ error: "Exercise not found" });
        }
        res.json({ message: "Exercise deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;