import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowHeaders: ["*"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("Something connected:", socket.id);

        // Handling user joining a call
        socket.on("join-call", (path) => {
            console.log("join-call");

            if (connections[path] === undefined) {
                connections[path] = [];
            }
            connections[path].push(socket.id);
            timeOnline[socket.id] = new Date();

            // Notify existing users of the new connection
           for(let a = 0;a<connections[path].length;a++){
            io.to(connections[path][a]).emit("user-joined",socket.id,connections[path])
           }
            
        });

        // Handling signaling for WebRTC
      socket.on("signal", (toId, message) => {
    try {
        const parsedMessage = JSON.parse(message); 
        io.to(toId).emit("signal", socket.id, message); 
    } catch (e) {
        console.error("Failed to parse signal message", e);
    }
});

       
        // Handling disconnect
        socket.on("disconnect", () => {
            const diffTime = Math.abs(timeOnline[socket.id] - new Date());

            for (const [k, v] of Object.entries(connections)) {
                const index = v.indexOf(socket.id);
                if (index !== -1) {
                    // Notify other users that this user has left
                    connections[k].forEach((ele) => {
                        io.to(ele).emit("user-left", socket.id);
                    });

                    // Remove user from connections
                    connections[k].splice(index, 1);

                    // If no users left, delete the room
                    if (connections[k].length === 0) {
                        delete connections[k];
                    }
                }
            }
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    return io;
};

export default initializeSocket;
