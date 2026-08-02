import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";

import app from "./app.js";

const port = 9000;

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

app.set("io", io);


const connectToMongo = async () => {
    while (true) {
        try {
            await mongoose.connect(process.env.MONGO_URI);
            console.log("Connected to MongoDB");
            break;
        } catch (err) {
            console.error("MongoDB connection failed:", err.message);
            console.error("Retrying in 3 seconds...");
            await new Promise((resolve) => setTimeout(resolve, 3000));
        }
    }
};

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("testMessage", (message) => {
        console.log("Received test message:", message);

        io.emit("testMessage", {
            message,
            time: new Date().toLocaleTimeString()
        });
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

const startServer = async () => {
    await connectToMongo();

    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

startServer();