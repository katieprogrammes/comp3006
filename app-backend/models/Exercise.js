import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true,
    },
    workoutId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Workout",
        required: true,
    },
    exerciseName: {
        type: String,
        required: true
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
    notes: {
        type: String,
        required: false
    }
},
{
    timestamps: true
});

export default mongoose.model("Exercise", exerciseSchema);
