import express from "express";
import User from "../models/User.js";
import Workout from "../models/Workout.js";

const router = express.Router();

//Get all workouts
router.get("/", async (req, res) => {
  try {
    const workouts = await Workout.find();
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: "Error fetching workouts" });
  }
});

//Get a workout by ID
router.get("/:id", async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);
        if (!workout) {
            return res.status(404).json({ error: "Workout not found" });
        }
        res.json(workout);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});``

//Create workouts
router.post("/", async (req, res) => {
    try {
        const { workoutName, workoutType, muscleGroup, date, notes } = req.body;

        const workout = await Workout.create({
            workoutName,
            workoutType,
            muscleGroup,
            date,
            notes
        });
        res.status(201).json(workout);
    } catch (err) {
        console.error("Error creating workout:", err);
        res.status(500).json({ error: err.message });
    }
});

//Update a workout by ID
router.put("/:id", async (req, res) => {
    try {
        const { workoutName, workoutType, muscleGroup, date, notes } = req.body;

        const workout = await Workout.findByIdAndUpdate(
            req.params.id,
            {
                workoutName,
                workoutType,
                muscleGroup,
                date,
                notes
            },
            { new: true }
        );

        if (!workout) {
            return res.status(404).json({ error: "Workout not found" });
        }
        res.json(workout);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Delete a workout by ID
router.delete("/:id", async (req, res) => {
    try {
        const workout = await Workout.findByIdAndDelete(req.params.id);
        if (!workout) {
            return res.status(404).json({ error: "Workout not found" });
        }
        res.json({ message: "Workout deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}); 

export default router;