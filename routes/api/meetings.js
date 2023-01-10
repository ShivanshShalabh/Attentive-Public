const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Meeting = require("../../models/Meeting");
const Classroom = require("../../models/Classroom");
const User = require("../../models/User");
router.use(express.static("public"));

// * route POST api/meetings/
// * desc Get all meetings
// * access Private
// * Testing: Passed ✔ (21-03-2022)

router.post("/", auth, async (req, res) => {
  const { isTeacher } = req.body.isTeacher;
  if (isTeacher)
    try {
      const meetings = await Meeting.find(
        { host: req.user.id },
        { __v: 0, host: 0, _id: 0 }
      ).sort({ date: -1 });
      return res.json(meetings);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  else
    try {
      const user = await User.findById(req.user.id);
      if (!user || !user.classrooms) return res.status(400).json({ msg: "No classroom found" });
      const meetings = await Meeting.find(
        { classroom: user.classrooms[0]?.code },
        { name: 1, date: 1, time: 1, id: 1, password: 1, classroom: 1 }
      ).sort({ date: -1 });
      return res.json(meetings);
    }
    catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }

});

// -------------------------------------------------->

// * route POST api/meetings/new
// * desc Save new meeting
// * access Private
// * Testing: Passed ✔ (21-03-2022)

router.post(
  "/new",
  [
    auth,
    [
      check("meetingName", "Invalid meeting name").not().isEmpty(),
      check("meetingDate", "Invalid meeting date").not().isEmpty().isDate(),
      check("meetingTime", "Invalid meeting time").not().isEmpty(),
      check("meetingId", "Invalid meeting ID").not().isEmpty().isLength(6),
      check("meetingPassword", "Invalid meeting password")
        .not()
        .isEmpty()
        .isLength({ min: 6, max: 10 }),
      check("participantsAudio", "Invalid participants audio")
        .not()
        .isEmpty()
        .isBoolean(),
      check("participantsVideo", "Invalid participants video")
        .not()
        .isEmpty()
        .isBoolean(),
      check("participantsChat", "Invalid participants chat")
        .not()
        .isEmpty()
        .isBoolean(),
      check("botEnable", "Invalid bot enable").not().isEmpty().isBoolean(),
      check("frequency", "Invalid frequency")
        .not()
        .isEmpty()
        .isInt({ min: 0, max: 100 }),
      check("minTime", "Invalid minimum time")
        .not()
        .isEmpty()
        .isInt({ min: 0, max: 100 }),
    ],
  ],
  async (req, res) => {
    const timeReg = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    let validationErrors = validationResult(req).array();
    if (
      req.body.botEnable &&
      (req.body.frequency <= 0 || req.body.minTime <= 0)
    )
      validationErrors.push({ msg: "Invalid bot details" });
    if (!timeReg.test(req.body.meetingTime))
      validationErrors.push({ msg: "Invalid meeting time" });
    if (validationErrors.length)
      return res.status(400).json({ errors: validationResult(req).array() });

    const {
      meetingName,
      meetingDate,
      meetingTime,
      meetingId,
      meetingPassword,
      participantsAudio,
      participantsVideo,
      participantsChat,
      botEnable,
      minTime,
      frequency,
      meetingClassroom
    } = req.body;
    try {
      let meetingExists = await Meeting.findOne({ id: meetingId });
      let meeting;
      if (meetingExists) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Meeting ID already exists" }] });
      }
      meeting = new Meeting({
        host: req.user.id,
        name: meetingName,
        date: meetingDate,
        time: meetingTime,
        id: meetingId,
        password: meetingPassword,
        botEnable: botEnable,
        botDetails: {
          minTime: botEnable ? minTime : 0,
          frequency: botEnable ? frequency : 0,
        },
        participantsPermissions: {
          audio: participantsAudio,
          video: participantsVideo,
          chat: participantsChat,
        },
        classroom: meetingClassroom ? meetingClassroom : "",
      });
      await meeting.save();
      return res.json(meeting);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

// -------------------------------------------------->

// * route POST api/meetings/update
// * desc Update meeting info
// * access Private
// * Testing: Passed ✔ (21-03-2022)

router.post(
  "/update",
  [
    auth,
    [
      check("meetingName", "Invalid meeting name").not().isEmpty(),
      check("meetingDate", "Invalid meeting date").not().isEmpty().isDate(),
      check("meetingTime", "Invalid meeting time").not().isEmpty(),
      check("meetingId", "Invalid meeting ID").not().isEmpty().isLength(6),
      check("meetingPassword", "Invalid meeting password")
        .not()
        .isEmpty()
        .isLength({ min: 6, max: 10 }),
      check("participantsAudio", "Invalid participants audio")
        .not()
        .isEmpty()
        .isBoolean(),
      check("participantsVideo", "Invalid participants video")
        .not()
        .isEmpty()
        .isBoolean(),
      check("participantsChat", "Invalid participants chat")
        .not()
        .isEmpty()
        .isBoolean(),
      check("botEnable", "Invalid bot enable").not().isEmpty().isBoolean(),
      check("frequency", "Invalid frequency")
        .not()
        .isEmpty()
        .isInt({ min: 0, max: 100 }),
      check("minTime", "Invalid minimum time")
        .not()
        .isEmpty()
        .isInt({ min: 0, max: 100 }),
    ],
  ],
  async (req, res) => {
    const timeReg = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    let validationErrors = validationResult(req).array();
    if (
      req.body.botEnable &&
      (req.body.frequency <= 0 || req.body.minTime <= 0)
    )
      validationErrors.push({ msg: "Invalid bot details" });
    if (!timeReg.test(req.body.meetingTime))
      validationErrors.push({ msg: "Invalid meeting time" });
    if (validationErrors.length)
      return res.status(400).json({ errors: validationResult(req).array() });

    const {
      meetingName,
      meetingDate,
      meetingTime,
      meetingId,
      meetingPassword,
      participantsAudio,
      participantsVideo,
      participantsChat,
      botEnable,
      minTime,
      frequency,
      meetingClassroom
    } = req.body;
    try {
      let meetingExists = await Meeting.findOne({ id: meetingId });

      if (!meetingExists) {
        return res.send("Meeting not found");
      } else if (
        meetingExists &&
        meetingExists.host.toString() !== req.user.id
      ) {
        return res.status(400).json({ errors: [{ msg: "Unauthorized" }] });
      }
      let meeting = await Meeting.findOneAndUpdate(
        { id: meetingId },
        {
          $set: {
            name: meetingName,
            date: meetingDate,
            time: meetingTime,
            password: meetingPassword,
            participantsPermissions: {
              audio: participantsAudio,
              video: participantsVideo,
              chat: participantsChat,
            },
            botEnable: botEnable,
            botDetails: {
              minTime: botEnable ? minTime : 0,
              frequency: botEnable ? frequency : 0,
            },
            classroom: meetingClassroom ? meetingClassroom : "",
          },
        },
        { new: true }
      );
      await meeting.save();
      return res.json(meeting);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

// -------------------------------------------------->

// * route POST api/meetings/delete
// * desc Delete a meeting
// * access Private
// * Testing: Passed ✔ (16-05-2022)

router.post(
  "/delete",
  [
    auth,
    [check("meetingId", "Invalid meeting ID").not().isEmpty().isLength(6)],
  ],
  async (req, res) => {
    if (!validationResult(req).isEmpty())
      return res.status(400).json({ errors: validationResult(req).array() });
    const { meetingId } = req.body;
    try {
      let meetingExists = await Meeting.findOne({ id: meetingId });
      if (!meetingExists) {
        return res.send("Meeting not found");
      }
      if (meetingExists.host.toString() !== req.user.id) {
        return res.status(400).json({ errors: [{ msg: "Unauthorized" }] });
      }
      await Meeting.findOneAndRemove({ id: meetingId });
      const meetings = await Meeting.find(
        { host: req.user.id },
        { __v: 0, host: 0, _id: 0 }
      ).sort({ date: -1 });
      return res.json(meetings);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

// -------------------------------------------------->

// * route POST api/meetings/get-info
// * desc Get info of a meeting
// * access Private
// * Testing: Passed ✔ (16-05-2022)

router.post(
  "/get-info",
  [
    auth,
    [check("meetingId", "Invalid meeting ID").not().isEmpty().isLength(6)],
  ],
  async (req, res) => {
    if (!validationResult(req).isEmpty())
      return res.status(400).json({ errors: validationResult(req).array() });
    const { meetingId } = req.body;
    try {
      let meetingExists = await Meeting.findOne({ id: meetingId });
      if (!meetingExists) {
        return res.status(400).json({ errors: [{ msg: "Meeting not found" }] });
      }
      const meeting = await Meeting.findOne(
        { id: meetingId },
        { __v: 0, host: 0, _id: 0 }
      );
      meetingExists.host.toString() !== req.user.id && delete meeting.password;
      return res.json(meeting);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

// -------------------------------------------------->

// * route POST api/meetings/check-password
// * desc Check password of a meeting
// * access Private
// * Testing: Passed ✔ (16-05-2022)

router.post(
  "/check-password",
  [
    auth,
    [
      check("meetingId", "Invalid meeting ID").not().isEmpty().isLength(6),
      check("meetingPassword", "Invalid meeting password").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    if (!validationResult(req).isEmpty())
      return res.status(400).json({ errors: validationResult(req).array() });
    const { meetingId, meetingPassword } = req.body;
    try {
      let meetingExists = await Meeting.findOne({ id: meetingId });
      if (!meetingExists || meetingExists.password !== meetingPassword) return res
        .status(400)
        .json({ errors: [{ msg: "Invalid Meeting Id/Password" }] });
      if (meetingExists.classroom && meetingExists.host.toString() !== req.user.id) {
        const classroom = await Classroom.findOne({
          code: meetingExists.classroom,
        });
        let memberCheck = false;
        (classroom?.students?.verified ?? [] + classroom?.teachers?.verified ?? []).forEach(member => {
          memberCheck = member.id.toString() === req.user.id || memberCheck;
        }
        );
        if (!memberCheck) return res.status(400).json({ errors: [{ msg: "This meeting is private. Please join the classroom to join the meeting." }] });
      }

      const meeting = meetingExists.toObject();
      delete meeting.__v;
      delete meeting.host;
      delete meeting._id;
      return res.json(meeting);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
