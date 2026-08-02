import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import User from "../models/User.js";
import Workout from "../models/Workout.js";
import Exercise from "../models/Exercise.js";

let token;
let workoutId;

const validExercise = {
    exerciseName: "Test Exercise",
    sets: 3,
    reps: 10,
    weight: 50,
    date: new Date(),
    notes: "Exercise created during testing"
};

const registerUser = async (
    name,
    email,
    password = "password123"
) => {
    return request(app)
        .post("/auth/register")
        .send({ name, email, password });
};

const createdWorkout = async (token) => {
    return request(app)
        .post("/workouts")
        .set("Authorization", `Bearer ${token}`)
        .send({
            workoutName: "Test Workout",
            workoutType: "Strength",
            muscleGroup: "Chest",
            date: new Date(),
            notes: "Workout created during testing"
        });
};

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_TEST_URI);
});

beforeEach(async () => {
    await User.deleteMany({});
    await Workout.deleteMany({});
    await Exercise.deleteMany({});

    const userResponse = await registerUser(
        "Exercise Test User",
        "exercise@example.com"
    );
    token = userResponse.body.token;

    const workoutResponse = await createdWorkout(token);
    workoutId = workoutResponse.body._id;
});

afterAll(async () => {
    await User.deleteMany({});
    await Workout.deleteMany({});
    await Exercise.deleteMany({});
    await mongoose.connection.close();
});

describe("Exercise Routes", () => {
    test("rejects a request without a valid token", async () => {
        const response = await request(app)
            .get("/exercises");
        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Access denied. No token provided.");
    });

    test("creates an exercise for the authenticated user", async () => {
        const response = await request(app)
            .post("/exercises")
            .set("Authorization", `Bearer ${token}`)
            .send({ workoutId, ...validExercise });
        
        expect(response.status).toBe(201);
        expect(response.body.exerciseName).toBe("Test Exercise");
        expect(response.body.sets).toBe(3);
        expect(response.body.reps).toBe(10);
        expect(response.body.weight).toBe(50);
        expect(response.body.notes).toBe("Exercise created during testing");
        expect(response.body.workoutId).toBe(workoutId);
        expect(response.body.userId).toBeDefined();

        const savedExercise = await Exercise.findById(response.body._id);
        expect(savedExercise).not.toBeNull();
        expect(savedExercise.exerciseName).toBe("Test Exercise");
    });

    test("returns the authenticated user's exercises", async () => {
        await request(app)
            .post("/exercises")
            .set("Authorization", `Bearer ${token}`)
            .send({ workoutId, ...validExercise });

        await request(app)
            .post("/exercises")
            .set("Authorization", `Bearer ${token}`)
            .send({
                workoutId,
                exerciseName: "Another Exercise",
                sets: 4,
                reps: 12,
                weight: 60,
                date: new Date(),
                notes: "Another exercise created during testing"
            });
        const response = await request(app)
            .get("/exercises")
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    });

    test("returns exercises for a specific workout", async () => {
        await request(app)
            .post("/exercises")
            .set("Authorization", `Bearer ${token}`)
            .send({ workoutId, ...validExercise });

        const secondWorkoutResponse = await request(app)
            .post("/workouts")
            .set("Authorization", `Bearer ${token}`)
            .send({
                workoutName: "Second Test Workout",
                workoutType: "Cardio",
                muscleGroup: "Legs",
                date: new Date(),
                notes: "Second workout created during testing"
            });
        const secondWorkoutId = secondWorkoutResponse.body._id;

        await request(app)
            .post("/exercises")
            .set("Authorization", `Bearer ${token}`)
            .send({
                workoutId: secondWorkoutId,
                exerciseName: "Second Workout Exercise",
                sets: 5,
                reps: 15,
                weight: 70,
                date: new Date(),
                notes: "Exercise for second workout"
            });
        const response = await request(app)
            .get(`/exercises/workout/${workoutId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].exerciseName).toBe("Test Exercise");
        expect(response.body[0].workoutId).toBe(workoutId);
    });

    test("returns one exercise by its ID", async () => {
        const createResponse = await request(app)
            .post("/exercises")
            .set("Authorization", `Bearer ${token}`)
            .send({ workoutId, ...validExercise });
        const exerciseId = createResponse.body._id;

        const response = await request(app)
            .get(`/exercises/${exerciseId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(exerciseId);
        expect(response.body.exerciseName).toBe("Test Exercise");
    });

    test("updates an exercise for the authenticated user", async () => {
        const createResponse = await request(app)
            .post("/exercises")
            .set("Authorization", `Bearer ${token}`)
            .send({ workoutId, ...validExercise });
        const exerciseId = createResponse.body._id;

        const response = await request(app)
            .put(`/exercises/${exerciseId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ ...validExercise, exerciseName: "Updated Exercise" });
        expect(response.status).toBe(200);
        expect(response.body.exerciseName).toBe("Updated Exercise");
        expect(response.body.sets).toBe(3);
        expect(response.body.reps).toBe(10);
        expect(response.body.weight).toBe(50);
        expect(response.body.notes).toBe("Exercise created during testing");

        const updatedExercise = await Exercise.findById(exerciseId);
        expect(updatedExercise.exerciseName).toBe("Updated Exercise");

        expect(updatedExercise.sets).toBe(3);
        expect(updatedExercise.reps).toBe(10);
        expect(updatedExercise.weight).toBe(50);
        expect(updatedExercise.notes).toBe("Exercise created during testing");
    });

    test("deletes an exercise for the authenticated user", async () => {
        const createResponse = await request(app)
            .post("/exercises")
            .set("Authorization", `Bearer ${token}`)
            .send({ workoutId, ...validExercise });
        const exerciseId = createResponse.body._id;

        const response = await request(app)
            .delete(`/exercises/${exerciseId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);

        expect(response.body.message).toBe("Exercise deleted successfully");
        const deletedExercise = await Exercise.findById(exerciseId);
        expect(deletedExercise).toBeNull();
    });

    test("returns 404 when creating an exercise for a non-existent workout", async () => {
        const nonExistentWorkoutId = new mongoose.Types.ObjectId();
        const response = await request(app)
            .post("/exercises")
            .set("Authorization", `Bearer ${token}`)
            .send({ workoutId: nonExistentWorkoutId, ...validExercise });
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Workout not found");
    });

    test("returns 404 for a non-existent exercise", async () => {
        const nonExistentExerciseId = new mongoose.Types.ObjectId();
        const response = await request(app)
            .get(`/exercises/${nonExistentExerciseId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Exercise not found");
    });
    
    test("does not allow a user to access another user's exercise", async () => {
        const createResponse = await request(app)
            .post("/exercises")
            .set("Authorization", `Bearer ${token}`)
            .send({ workoutId, ...validExercise });
        const exerciseId = createResponse.body._id;

        const otherUserResponse = await registerUser(
            "Other User",
            "otheruser@example.com"
        );
        const otherUserToken = otherUserResponse.body.token;

        const response = await request(app)
            .get(`/exercises/${exerciseId}`)
            .set("Authorization", `Bearer ${otherUserToken}`);
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Exercise not found");
    });

    test("does not create an exercise for another user's workout", async () => {
        const otherUserResponse = await registerUser(
            "Other User",
            "otheruser@example.com"
        );
        const otherUserToken = otherUserResponse.body.token;

        const response = await request(app)
            .post("/exercises")
            .set("Authorization", `Bearer ${otherUserToken}`)
            .send({ workoutId, ...validExercise });
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Workout not found");
    });
});
