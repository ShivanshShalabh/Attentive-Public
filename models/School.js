const mongoose = require("mongoose");

const SchoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  board: {
    type: String,
    required: true,
  },
  affiliationCode: {
    type: String,
    required: true,
  },
  udise: {
    type: String,
    required: true,
    length: 11,
    unique: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  // grades will be a dict of grades and sections
  classrooms: {
    type: Object,
  },
});

module.exports = Meeting = mongoose.model("school", SchoolSchema);
