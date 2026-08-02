import express from "express";
import cors from "cors";

import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import workoutsRouter from "./routes/workouts.js";
import exercisesRouter from "./routes/exercises.js";

const app = express();

app.use(express.json());
app.use(cors());

app.set("io", {
    emit: () => {}
});

app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/workouts", workoutsRouter);
app.use("/exercises", exercisesRouter);

app.get("/", (req, res) => {
    res.send("Gym Workout Record System API is running.");
});

export default app;

//safe for SuperTest, does not have mongo connection or port listening, that is done in server.js