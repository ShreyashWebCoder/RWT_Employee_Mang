const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors")
const cloudinary = require("cloudinary").v2;

const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

//  CORS
const corsOptions = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "credentials": true
}
app.use(cors(corsOptions));



const authRouter = require("./routes/user.router");
const postRouter = require("./routes/post.router");

//  Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


//  Default route
app.get("/", (req, res) => {
    res.send("Server Start !")
})

//  Routes
app.use("/api/auth", authRouter);
app.use("/post", postRouter)


//  Server Start
app.listen(process.env.PORT, () => {
    connectDB();
    console.log(`Server is ruuning up ! PORT : ${process.env.PORT}`);

})
