const mongoose = require("mongoose");

const ClassroomSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    length: 6,
  },
  classTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  grade: {
    type: Number,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    ref: "school",
    required: true,
    minlength: 4,
    maxlength: 10,
  },
  teachers: {
    verified: [
      {
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
        id: {
          type: mongoose.SchemaTypes.ObjectId,
          required: true,
          ref: "User",
        },
      },
    ],
    unverified: [
      {
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
        id: {
          type: mongoose.SchemaTypes.ObjectId,
          required: true,
          ref: "User",
        },
      },
    ],
    blocked: [
      {
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
        id: {
          type: mongoose.SchemaTypes.ObjectId,
          required: true,
          ref: "User",
        },
      },
    ],
  },
  students: {
    verified: [
      {
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
        id: {
          type: mongoose.SchemaTypes.ObjectId,
          required: true,
          ref: "User",
        },
      },
    ],
    unverified: [
      {
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
        id: {
          type: mongoose.SchemaTypes.ObjectId,
          required: true,
          ref: "User",
        },
      },
    ],
    blocked: [
      {
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
        id: {
          type: mongoose.SchemaTypes.ObjectId,
          required: true,
          ref: "User",
        },
      },
    ],
  },
});

module.exports = Meeting = mongoose.model("classroom", ClassroomSchema);
