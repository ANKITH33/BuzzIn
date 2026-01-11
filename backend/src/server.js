import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import Room from './models/Room.js';
import mongoose from "mongoose";


import roomRoutes from "./routes/roomRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import {connectDB} from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import Team from "./models/Team.js";

const leaderboardCache = new Map();
const playersCache = new Map();

dotenv.config();//helps read the env file
const app = express();
const PORT=process.env.PORT || 5001;


app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://buzz-in-coral.vercel.app",
    "https://buzz-difv6uqhd-ankith33s-projects.vercel.app",
  ],
  
  methods: ["GET", "POST", "OPTIONS"],
}));
app.use(express.json());// this middleware will parse json bodies : req.body

app.use((req,res,next) => {
    console.log(`Request method is ${req.method} and request url is ${req.url}`);
    next();
})

app.set("leaderboardCache", leaderboardCache);
app.set("playersCache", playersCache);

app.use("/api/rooms", roomRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/teams", teamRoutes);
app.use(rateLimiter);

connectDB().then(()=>{
    const server = http.createServer(app);//creates a raw HTTP server

    const io = new Server(server, {
    cors: {
        origin: [
        "http://localhost:5173",
        "https://buzz-in-coral.vercel.app",
        "https://buzz-difv6uqhd-ankith33s-projects.vercel.app",
        ],
        methods: ["GET", "POST"],
    }
    });//Socket.IO attaches itself to the existing HTTP server and listens for socket connections coming to that server.

    io.on("connection", (socket) => { //Whenever any browser connects using Socket.IO, run this function
        socket.on("join-room", ({roomCode,teamName}) => {
            socket.join(roomCode);//Adds THIS socket to an internal group named roomCode, all users in the room share a connection
            socket.teamName=teamName;
            socket.roomCode= roomCode;
        });

        socket.on("disconnect", async () =>{
            const { roomCode, teamName } = socket;
            if (!roomCode || !teamName) return;

            const room = await Room.findOne({code: roomCode});
            if(!room || !room.quiz){
                return ;
            }

            const team= await Team.findOneAndUpdate({quiz: room.quiz, teamName: teamName},{isActive:false});
            leaderboardCache.delete(room.quiz.toString());
            playersCache.delete(room.quiz.toString());

            io.to(roomCode).emit("players-updated");
            if (!socket.handshake.leaderboardEmitted) {
                io.to(roomCode).emit("leaderboard-updated");
                socket.handshake.leaderboardEmitted = true;
            }

        })
    });

    app.set("io", io);//Store this value inside the Express app under this key.

    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})//programming practice we need to connect to db first
