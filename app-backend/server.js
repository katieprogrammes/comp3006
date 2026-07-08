import express from "express";
import mongoose from "mongoose";
import usersRouter from "./routes/users.js";
import workoutsRouter from "./routes/workouts.js";
import exercisesRouter from "./routes/exercises.js";

const app = express();
const port = 9000;

app.use(express.json());
app.use("/workouts", workoutsRouter);
app.use("/users", usersRouter);
app.use("/exercises", exercisesRouter);

app.get("/", (req, res) => {
    res.send("Gym Workout Record System Backend");
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});