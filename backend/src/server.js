import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import roomRoutes from "./routes/roomRoutes.js";
import quizRoutes from "./routes/quizRoutes.js"
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

connectDB().then(()=>{
    app.listen(PORT, () => {
        console.log("Server is running on port 5001");
    });
})//programming practice we need to connect to db first
