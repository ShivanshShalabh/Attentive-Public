const mongoose = require("mongoose");

const MembersSchoolSchema = new mongoose.Schema({
  schoolCode: {
    type: String,
    ref: "School",
    required: true,
    unique: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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

module.exports = Meeting = mongoose.model(
  "MembersSchool",
  MembersSchoolSchema
);
