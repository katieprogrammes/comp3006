import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import workoutsRouter from "./routes/workouts.js";
import exercisesRouter from "./routes/exercises.js";

const app = express();

const port = 9000;

console.log(process.env.JWT_SECRET);

app.use(express.json());
app.use(cors());
app.use("/workouts", workoutsRouter);
app.use("/users", usersRouter);
app.use("/exercises", exercisesRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
    res.send("Gym Workout Record System Backend");
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});