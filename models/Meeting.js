const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    botEnable: {
        type: Boolean,
        required: true
    },
    botDetails: {
        frequency: {
            type: Number,
            required: true
        },
        minTime: {
            type: Number,
            required: true
        }
    },
    
    participantsPermissions: {
        audio: {
            type: Boolean,
            required: true
        },
        video: {
            type: Boolean,
            required: true
        },
        chat: {
            type: Boolean,
            required: true
        }
        
    },
    classroom: {
        type: String
    },
});

module.exports = Meeting = mongoose.model("meeting", MeetingSchema);