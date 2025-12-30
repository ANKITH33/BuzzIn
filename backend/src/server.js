import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";


import roomRoutes from "./routes/roomRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import {connectDB} from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();//helps read the env file
const app = express();
const PORT=process.env.PORT || 5001;


app.use(cors({
    origin: "http://localhost:5173",
}));
app.use(express.json());// this middleware will parse json bodies : req.body

app.use((req,res,next) => {
    console.log(`Request method is ${req.method} and request url is ${req.url}`);
    next();
})

app.use(rateLimiter);
app.use("/api/rooms", roomRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/teams", teamRoutes);

connectDB().then(()=>{
    const server = http.createServer(app);

    const io = new Server(server, {
        cors: { origin: "http://localhost:5173" }
    });

    io.on("connection", (socket) => {
        socket.on("join-room", (roomCode) => {
            socket.join(roomCode);
        });
    });

    app.set("io", io);

    server.listen(PORT, () => {
        console.log("Server running on port 5001");
    });
})//programming practice we need to connect to db first
