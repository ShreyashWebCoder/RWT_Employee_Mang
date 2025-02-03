const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); 

const authMiddleware = async (req, res, next) => {
    try {
        
        const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ","");
        console.log(token);
        
        if (!token) {
            return res.status(401).json({
                message: "Authentication failed! No token provided.",
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        const user = await User.findById(decoded.token);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

       
        req.user = user;
        next(); 
    } catch (error) {
        return res.status(401).json({
            message: "Authentication failed! Invalid token.",
            error: error.message,
        });
    }
};

module.exports = authMiddleware;


//   1st 

// const User = require("../models/user.model")
// const jwt = require("jsonwebtoken")

// const authMiddleware = async (req, res, next) => {
//     try {
//         const token = req.cookies.token;
//         if (!token) {

//             return res.status(400).json({
//                 message: "Token not found !"

//             })
//         }
//         console.log("hello");

//         const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
//         if (!decoded) {
//             return res.status(400).json({
//                 message: "Invalid token !"
//             })
//         }

//         const user = await User.findById(decoded.token);
//         if (!user) {
//             return res.status(400).json({
//                 message: "User not Found !"
//             })
//         }
//         req.user = user;
//         next();

//     } catch (error) {
//         return res.status(400).json({
//             message: "Error in AuthMiddleware !",
//             error: error.message
//         })
//     }
// }


// module.exports = authMiddleware;