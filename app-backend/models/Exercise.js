import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
        required: true,
        unique: true
    },
    workoutId: {
        type: mongoose.Schema.Types.ObjectId, ref: "Workout",
        required: true,
        unique: true
    },
    sets: {
        type: Number,
        required: true
    },
    reps: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    notes: {
        type: String,
        required: false
    }
});

export default mongoose.model("Exercise", exerciseSchema);
