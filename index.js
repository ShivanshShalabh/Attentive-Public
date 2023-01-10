const express = require("express");
const app = express();
const connectDB = require("./config/db");
const path = require("path");

// for cross origin requests

const server = require("http").createServer(app);
const cors = require("cors");
app.use(cors());
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origins: "https://attentive.onrender.com/",
    methods: "GET, POST, PUT, DELETE, OPTIONS",
  },
});

meetingParticipants = [];

// * Socket.io

io.on("connection", (socket) => {

  socket.emit("me");
  // join meeting handler
  socket.on("join-meeting", ({ meetingId, meetingName, userId, peerID }) => {
    socket.join(meetingId);
    meetingParticipants[meetingId] = {
      ...(meetingParticipants[meetingId] || {}),
      [userId]: { name: meetingName, audio: false, video: false, present: false, botEnabled: false },
    };
    socket.to(meetingId).emit("user-connected", meetingParticipants[meetingId], userId, peerID);
    socket.emit("user-updated", meetingParticipants[meetingId]);

  });
  // message trasmission handler
  socket.on("send-message", ({ meetingId, message, userId, time, name }) =>
    socket.to(meetingId).emit("recieve-message", { message, userId, time, name })
  );
  // leave meeting handler
  socket.on("leave-meeting", ({ meetingId, userId }) => {
    socket.leave(meetingId);
    delete meetingParticipants[meetingId][userId]; 
    socket.to(meetingId).emit("user-disconnected", userId);
  }
  );
  // update participant state handler
  socket.on("update-participant-state", ({ meetingName, meetingId, userId, audio, video, present, botEnabled }) => {
    if (meetingParticipants?.[meetingId]?.[userId] !== undefined) meetingParticipants[meetingId][userId] = {
      name: meetingName,
      audio,
      video,
      present,
      botEnabled,
    };
    socket.to(meetingId).emit("user-updated", meetingParticipants[meetingId]);
    socket.emit("user-updated", meetingParticipants[meetingId]);
  }
  );
});

// * Middleware
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static("public"));

// * Connect to database
connectDB();

// * Routes
app.use("/api/alive", require("./routes/api/alive"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/meetings", require("./routes/api/meetings"));
app.use("/api/school", require("./routes/api/school"));
app.use("/api/classroom", require("./routes/api/classroom"));
// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// * Listen to port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
