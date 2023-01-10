const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        unique: true
    },
    meetingName: {
        type: String
    },
    labeledDescriptors: {
        type: Object
    }
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);