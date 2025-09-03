import app from './app.js';
import {createServer} from "node:http"
import initializeSocket from './controllers/socketM.js'
import {Server} from "socket.io"
import 'dotenv/config'



const port = process.env.port;
app.set("port",(process.env.port || 8080));

const server = createServer(app);
const io = initializeSocket(server);

io.on("error", (error) => {
    console.error("Socket.io Error:", error);
});

server.listen(app.get("port"), () => {
    console.log(`Server is running on ${port}`);
});

server.on("error", (error) => {
    console.error("Server Error:", error);
});