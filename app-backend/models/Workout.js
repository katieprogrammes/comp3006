import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
    /*userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },*/
    workoutName: {
        type: String,
        required: true
    },
    workoutType: {
        type: String,
        required: true,
        enum: ["Strength", "Cardio", "Flexibility", "Mixed"]
    },
    muscleGroup: {
        type: String,
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

export default mongoose.model("Workout", workoutSchema);