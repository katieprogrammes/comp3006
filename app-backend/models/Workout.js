import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    muscleGroup: {
        type: String,
        required: true,
        unique: false
    }
});

export default mongoose.model("Workout", workoutSchema);