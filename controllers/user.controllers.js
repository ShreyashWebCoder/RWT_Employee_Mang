const User = require("../models/user.model")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: "All fields are required !" });
        }

        const userExist = await User.findOne({ email });

        if (userExist) {
            return res
                .status(400)
                .json({ message: "User already registerd ! Please Login" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        if (!hashedPassword) {
            return res.status(400).json({ message: "Password hashing failed !" });
        }

        const user = new User({
            name,
            email,
            password: hashedPassword,
            phone
        });

        const newUser = await user.save();
        if (!newUser) {
            return res.status(400).json({ message: "User registration failed !" });
        }

        const accessToken = jwt.sign(
            { token: newUser._id },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: "7d" }
        );

        if (!accessToken) {
            return res
                .status(400)
                .json({ message: "Access token generation failed !" });
        }

        res.cookie("token", accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        

        res.status(201).json({
            message: `User Register Successfully ! Welcome ${newUser.name}`,
            data: newUser,
        });
    } catch (error) {
        return res.status(400).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email & Password are Required !"
            })
        }

        const userExist = await User.findOne({ email });
        if (!userExist) {
            return res.status(400).json({
                message: "Please Register First !"
            })
        }

        const passwordVaild = await bcrypt.compare(password, userExist.password);
        if (!passwordVaild) {
            return res.status(400).json({
                message: "Incorrect Credentials !"
            })
        }

        const accessToken = jwt.sign(
            { token: userExist._id },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: "7d" }
        );

        if (!accessToken) {
            return res.status(400).json({
                message: "Access token generation Failed in Login !",
            });
        }

        res.cookie("token", accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        

        res.status(200).json({
            message: `User Login Successfully ! Welcome ${userExist.name}`,
            data: userExist,
        });
    } catch (error) {
        return res.status(400).json({
            message: "Error in Login",
            error: error.message
        })
    }
}

exports.logout = async (req, res) => {
    try {
        res.clearCookie("token")
        res.status(200).json({
            message: "User Logout Successfully !",
        });
    } catch (error) {
        res.status(400).json({
            message: "Error in Logout !",
            error: error.message,
        });
    }
};

