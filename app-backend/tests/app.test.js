import request from "supertest";
import app from "../app.js";

describe("GET /", () => {
    test("returns the backend welcome message", async () => {
        const response = await request(app).get("/");
        expect(response.status).toBe(200);
        expect(response.text).toBe("Gym Workout Record System API is running.");
    });
});