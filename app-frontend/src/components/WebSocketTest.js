import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const WebSocketTest = () => {
    const socketRef = useRef(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socketRef.current = io("http://localhost:9000");

        socketRef.current.on("connect", () => {
            console.log("Connected to WebSocket:", socketRef.current.id);
        });

        socketRef.current.on("testMessage", (data) => {
            setMessages((previousMessages) => [
                ...previousMessages,
                data
            ]);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const sendTestMessage = () => {
        if (socketRef.current) {
            socketRef.current.emit("testMessage", "Hello from the frontend");
        }
    };

    return (
        <div className="card mt-3">
            <div className="card-body">
                <h3>WebSocket Test</h3>

                <button className="btn btn-warning" onClick={sendTestMessage}>
                    Send Test Message
                </button>

                <div className="mt-3">
                    {messages.length === 0 ? (
                        <p>No messages yet.</p>
                    ) : (
                        messages.map((item, index) => (
                            <p key={index}>
                                {item.time}: {item.message}
                            </p>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default WebSocketTest;