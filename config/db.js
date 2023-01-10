const mongoose = require('mongoose');
const db = const  jstSecretKey  = require("../config/production").mongoURI;

// * desc    Connect to Database
// * Testing: Passed ✔ (20-03-2022)

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;