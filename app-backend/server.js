import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import workoutsRouter from "./routes/workouts.js";
import exercisesRouter from "./routes/exercises.js";

const app = express();
const port = 9000;

app.use(express.json());
app.use(cors());

app.use("/workouts", workoutsRouter);
app.use("/users", usersRouter);
app.use("/exercises", exercisesRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
    res.send("Gym Workout Record System Backend");
});

const connectToMongo = async () => {
    while (true) {
        try {
            await mongoose.connect(process.env.MONGO_URI);
            console.log("Connected to MongoDB");
            break;
        } catch (err) {
            console.error("MongoDB not ready yet. Retrying in 3 seconds...");
            await new Promise((resolve) => setTimeout(resolve, 3000));
        }
    }
};

const startServer = async () => {
    await connectToMongo();

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

startServer();