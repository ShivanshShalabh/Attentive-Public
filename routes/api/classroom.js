const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Classroom = require("../../models/Classroom");
const School = require("../../models/School");
router.use(express.static("public"));
const classroomFormatter = require("../../utils/classroomFormatter");
const MembersSchool = require("../../models/MembersSchool");
const User = require("../../models/User");
const userFormatter = require("../../utils/userFormatter");

// --------------------------------------->

// * route   POST /api/classroom/register
// * desc    Registers a classroom
// * access  Private
// * Testing: Passed ✔ (29-12-2022)

router.post(
  "/register",
  [
    auth,
    check("classGrade").isInt({ min: 1, max: 12 }),
    check("classCode").isLength(6),
    check("classSection").isLength(1),
    check("schoolCode").isLength({ min: 4, max: 10 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { classCode, classGrade, classSection, schoolCode } = req.body;
      const school = await School.findOne({ schoolCode });
      if (!school) {
        return res.status(400).json({ errors: [{ msg: "Invalid school code" }] });
      }
      const checkClassroom = await Classroom.findOne({
        school: schoolCode,
        grade: classGrade,
        section: classSection,
      });
      if (checkClassroom) {
        return res.status(400).json({
          errors: [
            {
              msg: "Classroom already exists",
            },
          ],
        });
      }
      const checkCode = await Classroom.findOne({ code: classCode });
      if (checkCode) {
        return res.status(400).json({
          errors: [
            {
              msg: "Classroom code already exists",
            },
          ],
        });
      }
      const newClassroom = new Classroom({
        code: classCode,
        grade: classGrade,
        section: classSection,
        school: schoolCode,
        classTeacher: req.user.id,
      });
      school.classrooms = school.classrooms || {};
      school.classrooms[classGrade] = school.classrooms[classGrade] || [];
      school.classrooms[classGrade].push(classSection);
      const user = await User.findById(req.user.id);
      user.classrooms = [...(user.classrooms || []), { grade: classGrade, section: classSection, code: classCode }];
      try {
        await school.save();
        await user.save();
        const classroom = await newClassroom.save();
        let classroomObj = classroom.toObject();
        res.json(classroomObj);
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);


// --------------------------------------->

// * route   POST /api/classroom/join
// * desc    Join a classroom
// * access  Private
// * Testing: Passed ✔ (29-12-2022)

router.post(
  "/join",
  [
    auth,
    check("classGrade").isInt({ min: 1, max: 12 }),
    check("classSection").isLength(1),
    check("schoolCode").isLength({ min: 4, max: 10 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const userTypes = ["students", "teachers"];

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!userTypes.includes(req.body.userType)) {
      return res.status(400).json({ errors: [{ msg: "Invalid user type" }] });
    }

    const { userType, classGrade, classSection, schoolCode } = req.body;
    const classroom = await Classroom.findOne({ grade: classGrade, section: classSection, school: schoolCode });

    if (!classroom) {
      return res.status(400).json({ errors: [{ msg: "Invalid classroom code" }] });
    }

    if (classroom.classTeacher.toString() === req.user.id) {
      return res.status(400).json({ errors: [{ msg: "You are the class teacher of this classroom" }] });
    }

    const memberSchool = await MembersSchool.findOne({
      schoolCode: classroom.school
    });
    let userVerfiied = false;
    memberSchool[userType].verified.forEach(verified => userVerfiied = verified.id.toString() === req.user.id || userVerfiied);
    if (!userVerfiied) {
      return res.status(400).json({ errors: [{ msg: "User not in school" }] });
    }

    let isBlocked = false;
    classroom[userType].blocked.forEach(blocked => isBlocked = blocked.id.toString() === req.user.id || isBlocked);
    if (isBlocked) {
      return res.status(400).json({ errors: [{ msg: "User is blocked" }] });
    }

    let isMember = false;
    classroom[userType].verified.forEach(member => isMember = member.id.toString() === req.user.id || isMember);
    if (isMember) {
      return res.status(400).json({ errors: [{ msg: "User is already registered to the classroom" }] });
    }

    let hasRequested = false;
    classroom[userType].unverified.forEach(requested => hasRequested = requested.id.toString() === req.user.id || hasRequested);
    if (hasRequested) {
      return res.status(400).json({ errors: [{ msg: "User has already requested to join the classroom" }] });
    }

    const user = await User.findById(req.user.id);
    classroom[userType].unverified.push({ id: req.user.id, name: user.name, email: user.email });
    user.joinRequest.classroom = {
      grade: classGrade,
      section: classSection,
      requestStatus: { processing: true, approved: false },
    };

    try {
      await classroom.save();
      await user.save();
      res.json(userFormatter(user));
    }
    catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);


// --------------------------------------->

// * route   GET /api/classroom/get
// * desc    Get classroom info
// * access  Public/Private
// * Testing: Passed ✔ (29-12-2022)

router
  // *Private: Give out all the info about the classroom to the Class Teacher
  .get("/get", auth, async (req, res) => {
    try {
      const classrooms = await Classroom.findOne({
        classTeacher: req.user.id,
      });
      res.json(classroomFormatter(classrooms, (isTeacher = true)));
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  })
  // *Private: Give out a list of all the students in the classroom to the students
  .get("/get/students/:code", auth, async (req, res) => {
    try {
      const classroom = await Classroom.findOne({
        code: req.params.code,
      });
      let verifiedStudentsPublicList = {};
      classroom.students.verified.forEach(student => {
        verifiedStudentsPublicList[student.id] = student.name;
      }
      );
      return res.json(verifiedStudentsPublicList);

    }
    catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
)
  // *Public: Give out a list of all the public info of the classroom to any user
  .get("/get/:code", auth, async (req, res) => {
    try {
      const classroom = await Classroom.findOne({
        code: req.params.code,
      });
      if (!classroom) {
        return res.status(404).json({
          errors: [
            {
              msg: "Classroom not found",
            },
          ],
        });
      }
      res.json(classroomFormatter(classroom, (isTeacher = false)));
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });

// --------------------------------------->

// * route   POST /api/classroom/actionMember
// * desc    Perform action on a member of the classroom
// * access  Private
// * Testing: Passed ✔ (29-12-2022)

router.post(
  "/actionMember",
  [
    auth,
    check("memberId", "Invalid memberId").not().isEmpty(),
    check("memberType", "Invalid memberType").not().isEmpty(),
    check("actionType", "Invalid actionType").not().isEmpty(),
  ],
  async (req, res) => {
    const validActionTypes = [
      "approve",
      "reject",
      "delete",
      "block_unverified",
      "block_verified",
      "unblock",
    ];
    const memberTypes = ["teachers", "students"];
    const errors = validationResult(req);
    if (!memberTypes.includes(req.body.memberType)) {
      return res.status(400).json({ errors: [{ msg: "Invalid memberType" }] });
    }

    if (!validActionTypes.includes(req.body.actionType)) {
      return res.status(400).json({ errors: [{ msg: "Invalid actionType" }] });
    }

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { memberId, memberType, actionType } = req.body;
    const member = await User.findById(memberId);
    const classroom = await Classroom.findOne({ classTeacher: req.user.id });
    if (!classroom) return res.status(400).json({ errors: [{ msg: "School not found" }] });

    const removeMemberFromUnverified = (memberId, memberType) => {
      classroom[memberType].unverified.forEach((teacher, index) => {
        if (teacher.id.toString() === memberId) {
          classroom[memberType].unverified.splice(index, 1);
        }
      });
    };

    const removeMemberFromVerified = (memberId, memberType) => {
      classroom[memberType].verified = classroom[
        memberType
      ].verified.filter((teacher) => teacher.id.toString() !== memberId);
    };
    
    const removeClassroomFromVerifiedMemberProfile = (classCode) => (member.classrooms.filter((classroom) => classroom.code !== classCode));

    const removeClassroomFromUnverifiedMemberProfile = (grade, section) => {
      member.joinRequest.classroom = {
        grade,
        section,
        requestStatus: { processing: false, approved: false },
      };
    };

    const memberDetails = {
      name: member.name,
      email: member.email,
      id: member.id,
    };

    // * approve
    if (actionType === "approve") {
      removeMemberFromUnverified(memberId, memberType);
      classroom[memberType].verified.push(memberDetails);
      // changing member request status
      member.joinRequest.classroom = null;
      member.classrooms = [...(member.classrooms ?? []), { grade: classroom.grade, section: classroom.section, code: classroom.code }];
    }
    // * reject
    else if (actionType === "reject") {
      removeMemberFromUnverified(memberId, memberType);
      removeClassroomFromUnverifiedMemberProfile(classroom.grade, classroom.section);
    }
    // * block_unverified
    else if (actionType === "block_unverified") {
      classroom[memberType].blocked.push(memberDetails);
      removeMemberFromUnverified(memberId, memberType);
      removeClassroomFromUnverifiedMemberProfile(classroom.grade, classroom.section);
    }
    // * block_verified
    else if (actionType === "block_verified") {
      {
        classroom[memberType].blocked.push(memberDetails);
        removeMemberFromVerified(memberId, memberType);
        removeClassroomFromVerifiedMemberProfile(classroom.code);
      }
    }
    // * unblock
    else if (actionType === "unblock") {
      classroom[memberType].blocked.forEach((teacher, index) => {
        if (teacher.id.toString() === memberId) {
          classroom[memberType].blocked.splice(index, 1);
        }
      });
    }
    // * delete
    else if (actionType === "delete") {
      removeMemberFromVerified(memberId, memberType);
      removeClassroomFromVerifiedMemberProfile(classroom.code);
    } else
      return res.status(400).json({ errors: [{ msg: "Invalid actionType" }] });
    try {
      await classroom.save();
      await member.save();

      res.json({
        teachers: classroom.teachers,
        students: classroom.students,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
