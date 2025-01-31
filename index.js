const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors")
dotenv.config();
const cloudinary = require("cloudinary").v2;

const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
app.use(cors());

const authRouter = require("./routes/user.router");
const postRouter = require("./routes/post.router");

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


//  Default route
app.get("/", (req, res) => {
    res.send("Server Start !")
})

app.use("/api/auth", authRouter);
app.use("/post", postRouter)


//  Server Start
app.listen(process.env.PORT, () => {
    connectDB();
    console.log(`Server is ruuning up ! PORT : ${process.env.PORT}`);

})
