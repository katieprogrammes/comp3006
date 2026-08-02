import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import User from "../models/User.js";

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_TEST_URI);
});

beforeEach(async () => {
    await User.deleteMany({});
});

afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
});

describe("Authentication Routes", () => {
    test("POST /auth/register - should register a new user", async () => {
        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "password123"
            });
        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
        expect(response.body.user.name).toBe("Test User");
        expect(response.body.user.email).toBe("test@example.com");
    });

    test("rejects a password shorter than 8 characters", async () => {
        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "Short Password User",
                email: "short@example.com",
                password: "weak"
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe(
            "Password must contain at least 8 characters"
        );
    });

    test("rejects missing registration fields", async () => {
        const response = await request(app)
            .post("/auth/register")
            .send({
                email: "missing@example.com",
                password: "password123"
            });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe(
            "All fields are required"
        );
    });

    test("rejects duplicate email registration", async () => {
        await request(app)
            .post("/auth/register")
            .send({
                name: "First User",
                email: "duplicate@example.com",
                password: "password123"
            });

        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "Second User",
                email: "duplicate@example.com",
                password: "password456"
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe(
            "User already exists"
        );
    });

    test("logs in with valid credentials", async () => {
        await request(app)
            .post("/auth/register")
            .send({
                name: "Login User",
                email: "login@example.com",
                password: "password123"
            });

        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "login@example.com",
                password: "password123"
            });

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
        expect(response.body.user.email).toBe(
            "login@example.com"
        );
    });

    test("rejects an incorrect password", async () => {
        await request(app)
            .post("/auth/register")
            .send({
                name: "Login User",
                email: "wrong@example.com",
                password: "password123"
            });

        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "wrong@example.com",
                password: "incorrect123"
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe(
            "Invalid credentials"
        );
    });

    test("rejects an unknown email address", async () => {
        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "unknown@example.com",
                password: "password123"
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe(
            "Invalid credentials"
        );
    });
});