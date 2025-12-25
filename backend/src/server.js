import express from "express";
import routes from "./routes/routes.js";
import {connectDB} from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();//helps read the env file
const app = express();
const PORT=process.env.PORT || 5001;

connectDB();
app.use(cors());
app.use(express.json());

app.use("/teams", routes);
//app.use("/products", productroutes);
app.listen(PORT, () => {
    console.log("Server is running on port 5001");
});

//mongodb+srv://ankithkini43_db_user:SB9fL8h4AoAPFGmW@cluster0.ftm12yk.mongodb.net/?appName=Cluster0