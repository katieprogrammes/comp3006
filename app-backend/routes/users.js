import express from "express";
import User from "../models/User.js";
import Workout from "../models/Workout.js";
import Exercise from "../models/Exercise.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

//My account page
router.get("/account", async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        const [workoutCount, exerciseCount] = await Promise.all([
            Workout.countDocuments({
                userId: req.user.id
            }),
            Exercise.countDocuments({
                userId: req.user.id
            })
        ]);

        res.json({
            user,
            statistics: {
                workoutCount,
                exerciseCount
            }
        });
    } catch (err) {
        console.error("Error fetching account:", err);

        res.status(500).json({
            error: "Could not fetch account"
        });
    }
});

//Update logged-in user
router.put("/account", async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name?.trim() || !email?.trim()) { //removes excess whitespace
            return res.status(400).json({
                error: "Name and email are required"
            });
        }

        const normalisedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalisedEmail,
            _id: { $ne: req.user.id }
        });

        if (existingUser) {
            return res.status(400).json({
                error: "That email address is already in use"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                name: name.trim(),
                email: normalisedEmail
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        res.json(user);
    } catch (err) {
        console.error("Error updating account:", err);

        res.status(500).json({
            error: "Could not update account"
        });
    }
});

//Delete logged-in user
router.delete("/account", async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        await Promise.all([
            Exercise.deleteMany({
                userId: req.user.id
            }),
            Workout.deleteMany({
                userId: req.user.id
            })
        ]);

        await User.findByIdAndDelete(req.user.id);

        res.json({
            message: "Account deleted successfully"
        });
    } catch (err) {
        console.error("Error deleting account:", err);

        res.status(500).json({
            error: "Could not delete account"
        });
    }
});

//Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

//Get a user by ID
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;