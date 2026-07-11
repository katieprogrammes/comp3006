import express from "express";
import User from "../models/User.js";
import Workout from "../models/Workout.js";
import Exercise from "../models/Exercise.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(authMiddleware);

//Get exercises for a specific workout
router.get("/workout/:workoutId", authMiddleware, async (req, res) => {
    try {
        const exercises = await Exercise.find({ 
            userId: req.user.id,
            workoutId: req.params.workoutId });
        res.json(exercises);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Get all exercises for the logged-in user
router.get("/", async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ error: "Error fetching exercises" });
  }
});

//Weekly Leaderboard Logic
router.get("/leaderboard/weekly", async (req, res) => {
    try {
        const now = new Date();
        const startOfWeek = new Date(now);
        const day = startOfWeek.getDay();
        const daysSinceMonday = day === 0 ? 6 : day - 1; //Adjust for Sunday being 0
        startOfWeek.setDate(now.getDate() - daysSinceMonday);
        startOfWeek.setHours(0, 0, 0, 0); //Set to the start of the day

        const leaderboard = await Exercise.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfWeek }
                }
            },
            {
                $sort: {
                    weight: -1 //Sorts by weight in descending order
                }
            },
            {
                $group: {
                    _id: "$userId",
                    heaviestWeight: { $first: "$weight" },
                    exerciseName: { $first: "$exerciseName" },
                    sets: { $first: "$sets" },
                    reps: { $first: "$reps" },
                    createdAt: { $first: "$createdAt" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    _id: 0,
                    userId: "$_id",
                    name: "$user.name",
                    heaviestWeight: 1,
                    exerciseName: 1,
                    sets: 1,
                    reps: 1,
                    createdAt: 1
                }
            },
            {
                $sort: {
                    heaviestWeight: -1
                }
            }
        ]);

        res.json(leaderboard);
    } catch (err) {
        console.error("Error fetching leaderboard:", err);
        res.status(500).json({ error: err.message });
    }
});



//Get an exercise by ID
router.get("/:id", async (req, res) => {
    try {
        const exercise = await Exercise.findOne({ _id: req.params.id, userId: req.user.id });
        if (!exercise) {
            return res.status(404).json({ error: "Exercise not found" });
        }
        res.json(exercise);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Create exercise
router.post("/", async (req, res) => {
    try {
        const {workoutId, exerciseName, sets, reps, weight, notes } = req.body;
        const workout = await Workout.findOne({ _id: workoutId, userId: req.user.id });
        if (!workout) {
            return res.status(404).json({ error: "Workout not found" });
        }

        const newExercise = await Exercise.create({ userId: req.user.id, workoutId, exerciseName, sets, reps, weight, notes });
        res.status(201).json(newExercise);
    } catch (err) {
        console.error("Error creating exercise:", err);
        res.status(500).json({ error: err.message });
    }
});

//Update an exercise by ID, ensuring it belongs to the logged-in user
router.put("/:id", async (req, res) => {
    try {
        const { workoutId, exerciseName, sets, reps, weight, notes } = req.body;
        const exercise = await Exercise.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, { workoutId, exerciseName, sets, reps, weight, notes }, { new: true });
        if (!exercise) {
            return res.status(404).json({ error: "Exercise not found" });
        }
        res.json(exercise);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Delete an exercise by ID, ensuring it belongs to the logged-in user
router.delete("/:id", async (req, res) => {
    try {
        const exercise = await Exercise.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!exercise) {
            return res.status(404).json({ error: "Exercise not found" });
        }
        res.json({ message: "Exercise deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;