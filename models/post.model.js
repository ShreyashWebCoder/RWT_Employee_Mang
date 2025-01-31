const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({

    text: {
        type: String,
        required: true,
    },
    media: {
        type: String,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        // type: String,
        ref: "user",
    }],
    comments: [{
        // type: mongoose.Schema.Types.ObjectId,
        type: String,
        ref: "user",
    }],

}, { timestamps: true });

module.exports = mongoose.model("post", postSchema);


// const mongoose = require("mongoose");

// const postSchema = new mongoose.Schema({
//     text: {
//         type: String,
//         required: true,
//     },
//     media: {
//         type: String,
//     },
//     author: {
//         type: mongoose.Schema.Types.ObjectId,  // Reference to User model
//         ref: "user",
//         required: true,
//     },
//     likes: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "user",
//     }],
//     comments: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "user",
//     }],

// }, { timestamps: true });

// module.exports = mongoose.model("post", postSchema);



