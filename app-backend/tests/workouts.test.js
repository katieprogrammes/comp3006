import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import User from "../models/User.js";
import Workout from "../models/Workout.js";

let token;

const validWorkout = {
    workoutName: "Test Workout",
    workoutType: "Strength",
    muscleGroup: "Chest",
    date: new Date(),
    notes: "Workout created during testing"
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

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_TEST_URI);
});

beforeEach(async () => {
    await User.deleteMany({});
    await Workout.deleteMany({});

    const response = await registerUser(
        "Workout Test User",
        "workout@example.com"
    );
    token = response.body.token;
});

afterAll(async () => {
    await User.deleteMany({});
    await Workout.deleteMany({});
    await mongoose.connection.close();
});

describe("Workout Routes", () => {
    test("rejects a request without a valid token", async () => {
        const response = await request(app)
        .get("/workouts");
        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Access denied. No token provided.");
    });

    test("creates a workout for the authenticated user", async () => {
        const response = await request(app)
            .post("/workouts")
            .set("Authorization", `Bearer ${token}`)
            .send(validWorkout);
        expect(response.status).toBe(201);
        expect(response.body.workoutName).toBe("Test Workout");
    
    
        expect(response.body.workoutType).toBe("Strength");
        expect(response.body.muscleGroup).toBe("Chest");
        expect(response.body.notes).toBe("Workout created during testing");

        expect(response.body.userId).toBeDefined();

        const savedWorkout = await Workout.findById(response.body._id);
        expect(savedWorkout).not.toBeNull();
        expect(savedWorkout.workoutName).toBe("Test Workout");
    });

    test("returns the authenticated user's workouts", async () => {
        await request(app)
            .post("/workouts")
            .set("Authorization", `Bearer ${token}`)
            .send(validWorkout);

        await request(app)
            .post("/workouts")
            .set("Authorization", `Bearer ${token}`)
            .send({
                workoutName: "Another Workout",
                workoutType: "Cardio",
                muscleGroup: "Full Body",
                date: new Date(),
                notes: "Second workout for testing"
            });
        const response = await request(app)
            .get("/workouts")
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
        expect(response.body[0].userId).toBe(
            response.body[1].userId
        );
    });
    
    test("returns one workout by its ID", async () => {
        const createResponse = await request(app)
            .post("/workouts")
            .set("Authorization", `Bearer ${token}`)
            .send(validWorkout);
        const workoutId = createResponse.body._id;

        const response = await request(app)
            .get(`/workouts/${workoutId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(workoutId);
        expect(response.body.workoutName).toBe("Test Workout");
    });

    test("updates an existing workout", async () => {
        const createResponse = await request(app)
            .post("/workouts")
            .set("Authorization", `Bearer ${token}`)
            .send(validWorkout);
        const workoutId = createResponse.body._id;

        const response = await request(app)
            .put(`/workouts/${workoutId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ workoutName: "Updated Workout Name" });
        expect(response.status).toBe(200);
        expect(response.body.workoutName).toBe("Updated Workout Name");
        expect(response.body.workoutType).toBe("Strength");
        expect(response.body.muscleGroup).toBe("Chest");
        expect(response.body.notes).toBe("Workout created during testing");

        const updatedWorkout = await Workout.findById(workoutId);
        expect(updatedWorkout.workoutName).toBe("Updated Workout Name");
    });

    test("deletes an existing workout", async () => {
        const createResponse = await request(app)
            .post("/workouts")
            .set("Authorization", `Bearer ${token}`)
            .send(validWorkout);
        const workoutId = createResponse.body._id;

        const response = await request(app)
            .delete(`/workouts/${workoutId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Workout deleted successfully");
        const deletedWorkout = await Workout.findById(workoutId);
        expect(deletedWorkout).toBeNull();
    });

    test("returns 404 for a non-existent workout", async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const response = await request(app)
            .get(`/workouts/${nonExistentId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Workout not found");
    });

    test("does not allow a user to access another user's workout", async () => {
        const secondUserResponse = await registerUser(
            "Second User",
            "seconduser@example.com"
        );
        const secondUserToken = secondUserResponse.body.token;

        const createResponse = await request(app)
            .post("/workouts")
            .set("Authorization", `Bearer ${secondUserToken}`).send({
                workoutName: "Second User Workout",
                workoutType: "Flexibility",
                muscleGroup: "Arms",
                date: new Date(),
                notes: "Workout for second user"
            });
        const secondUserWorkoutId = createResponse.body._id;

        const response = await request(app)
            .get(`/workouts/${secondUserWorkoutId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Workout not found");
    });

    test("only returns workouts for the authenticated user", async () => {
        await request(app)
            .post("/workouts")
            .set("Authorization", `Bearer ${token}`)
            .send(validWorkout);

        const secondUserResponse = await registerUser(
            "Second User",
            "private@example.com"
        );
        const secondUserToken = secondUserResponse.body.token;

        await request(app)
            .post("/workouts")
            .set("Authorization", `Bearer ${secondUserToken}`)
            .send({
                workoutName: "Private User Workout",
                workoutType: "Cardio",
                muscleGroup: "Glutes",
                date: new Date(),
                notes: "Should not be visible to the first user"
            });

        const response = await request(app)
            .get("/workouts")
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].workoutName).toBe("Test Workout");
    });
});