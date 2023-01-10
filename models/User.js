const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
  school: {
    type: String,
  },
  joinRequest: {
    school: {
      code: {
        type: String,
      },
      requestStatus: {
        processing: {
          type: Boolean,
        },
        approved: {
          type: Boolean,
        },
      }
    },
    classroom: {
      grade: {
        type: String,
      },
      section: {
        type: String,
      }
      ,
      requestStatus: {
        processing: {
          type: Boolean,
        },
        approved: {
          type: Boolean,
        },
      }
    }
  },
  classrooms: [
    {
      grade: {
        type: String,
      },
      section: {
        type: String,
      },
      code: {
        type: String,
      },
    }
  ],
});

module.exports = User = mongoose.model("user", UserSchema);
