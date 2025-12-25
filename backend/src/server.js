import express from "express";
import routes from "./routes/routes.js";
import {connectDB} from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();//helps read the env file
const app = express();
const PORT=process.env.PORT || 5001;


app.use(cors());
app.use(express.json());// this middleware will parse json bodies : req.body

app.use((req,res,next) => {
    console.log(`Request method is ${req.method} and request url is ${req.url}`);
    next();
})

app.use(rateLimiter);

app.use("/", routes);
//app.use("/products", productroutes);

connectDB().then(()=>{
    app.listen(PORT, () => {
        console.log("Server is running on port 5001");
    });
})//programming practice we need to connect to db first


//mongodb+srv://ankithkini43_db_user:SB9fL8h4AoAPFGmW@cluster0.ftm12yk.mongodb.net/?appName=Cluster0