const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    bio: {
        type: String
    },
    profilePic: {
        type: String
    },
    posts: {
        type: mongoose.Schema.ObjectId,
        ref: "post"
    },

}, { timestamps: true });


module.exports = new mongoose.model("user", userSchema);