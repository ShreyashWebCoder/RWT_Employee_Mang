const mongoose = require('mongoose');

const connectDB = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB connected SUCCESSFULLY...');

    } catch (error) {
        console.error('MongoDB connection FAILED !');
    }
}


module.exports = connectDB;