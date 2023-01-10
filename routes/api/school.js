const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const School = require("../../models/School");
const User = require("../../models/User");
const MembersSchool = require("../../models/MembersSchool");
const userFormatter = require("../../utils/userFormatter");
router.use(express.static("public"));

// * route   POST api/school/register
// * desc    Register a school
// * access  Private
// * Testing: Passed ✔ (19-05-2022)

router.post(
  "/register",
  [
    auth,
    check("schoolName", "Invalid schoolName")
      .not()
      .isEmpty()
      .isLength({ max: 50 }),
    check("schoolAddress", "Invalid schoolAddress")
      .not()
      .isEmpty()
      .isLength({ max: 100 }),
    check("schoolBoard", "Invalid schoolBoard")
      .not()
      .isEmpty()
      .isLength({ max: 40 }),
    check("schoolAffiliationCode", "Invalid schoolAffiliationCode")
      .not()
      .isEmpty()
      .isLength({ max: 20 }),
    check("schoolUDISE", "Invalid meeting password")
      .not()
      .isEmpty()
      .isLength(11),
    check("schoolCode", "Invalid schoolCode")
      .not()
      .isEmpty()
      .isLength({ min: 4, max: 10 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const schoolUDISECheck = await School.findOne({
      udise: req.body.schoolUDISE,
    });
    if (schoolUDISECheck) {
      return res
        .status(400)
        .json({ errors: [{ msg: "School UDISE already exists" }] });
    }
    const schoolCodeCheck = await School.findOne({ code: req.body.schoolCode });
    if (schoolCodeCheck) {
      return res.status(400).json({
        errors: [
          {
            msg: "School Code already exists\nPlease try another Unique Code",
          },
        ],
      });
    }
    const {
      schoolName,
      schoolAddress,
      schoolBoard,
      schoolAffiliationCode,
      schoolUDISE,
      schoolCode,
    } = req.body;
    const newSchool = new School({
      name: schoolName,
      address: schoolAddress,
      board: schoolBoard,
      affiliationCode: schoolAffiliationCode,
      udise: schoolUDISE,
      code: schoolCode,
    });

    const user = await User.findById(req.user.id);
    user.school = schoolCode;
    const teachersSchool = new MembersSchool({
      schoolCode,
      admin: req.user.id,
    });
    try {
      await newSchool.save();
      await user.save();
      await teachersSchool.save();
      res.json(userFormatter(user));
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// -------------------------------------------------->

// * route   GET api/school/teachers/all
// * desc    Get list of all the teachers of a school
// * access  Private
// * Testing: Passed ✔ (19-05-2022)

router.get("/teachers/all", auth, async (req, res) => {
  try {
    const teachersSchool = await MembersSchool.findOne({
      admin: req.user.id,
    });
    if (!teachersSchool) {
      return res.status(400).json({ msg: "No School Found" });
    }
    const teachers = teachersSchool.teachers;
    return res.json(teachers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// -------------------------------------------------->

// * route   GET api/school/students/all
// * desc    Get list of all the students of a school
// * access  Private
// * Testing: Passed ✔ (19-05-2022)

router.get("/students/all", auth, async (req, res) => {
  try {
    const teachersSchool = await MembersSchool.findOne({
      admin: req.user.id,
    });
    if (!teachersSchool) {
      return res.status(400).json({ msg: "No School Found" });
    }
    const students = teachersSchool.students;
    return res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// -------------------------------------------------->

// * route   POST api/school/get-info
// * desc    Get info of a school by school code
// * access  Private
// * Testing: Passed ✔ (19-05-2022)

router.post(
  "/get-info",
  [
    auth,
    check("schoolCode", "Invalid schoolCode")
      .not()
      .isEmpty()
      .isLength({ min: 4, max: 10 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const school = await School.findOne(
        { code: req.body.schoolCode },
        { _id: 0, __v: 0 }
      );
      if (!school) {
        return res.status(400).json({ errors: [{ msg: "School not found" }] });
      }
      return res.json(school);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// -------------------------------------------------->

// * route   POST api/school/join
// * desc    Request to join a school
// * access  Private
// * Testing: Passed ✔ (19-05-2022)

router.post(
  "/join",
  [
    auth,
    check("schoolCode", "Invalid schoolCode")
      .not()
      .isEmpty()
      .isLength({ min: 4, max: 10 }),
    check("userType", "Invalid userType").not().isEmpty(),
  ],
  async (req, res) => {
    const memberTypes = ["teachers", "students"];
    const { schoolCode, userType } = req.body;

    const errors = validationResult(req);
    if (!memberTypes.includes(userType))
      return res.status(400).json({ errors: [{ msg: "Invalid memberType" }] });
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const membersSchool = await MembersSchool.findOne({ schoolCode });
    if (!membersSchool)
      return res.status(400).json({ errors: [{ msg: "School not found" }] });

    let user = await User.findById(req.user.id);
    let isBlocked = false;
    membersSchool[userType].blocked.forEach((member) => isBlocked = member.id.toString() === user.id || isBlocked);
    if (isBlocked)
      return res
        .status(400)
        .json({ errors: [{ msg: "You are blocked from this school" }] });
    let isMember = false;
    membersSchool[userType].verified.forEach((member) => isMember = member.id.toString() === user.id || isMember);
    if (isMember)
      return res.status(400).json({ errors: [{ msg: "You are already a member of this school" }] });
    membersSchool[userType].unverified.push({
      name: user.name,
      email: user.email,
      id: user.id,
    });
    user.joinRequest.school = {
      code: schoolCode,
      requestStatus: { processing: true, approved: false },
    };
    try {
      await membersSchool.save();
      await user.save();
      res.json(userFormatter(user));
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// -------------------------------------------------->

// * route   POST api/school/actionMember
// * desc    Action on a member of a school
// * access  Private
// * Testing: Passed ✔  (29-12-2022)

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
    const membersSchool = await MembersSchool.findOne({
      admin: req.user.id,
    });

    const removeMemberFromUnverified = (memberId, memberType) => {
      membersSchool[memberType].unverified.forEach((teacher, index) => {
        if (teacher.id.toString() === memberId) {
          membersSchool[memberType].unverified.splice(index, 1);
        }
      });
    };
    const removeMemberFromVerified = (memberId, memberType) => {
      membersSchool[memberType].verified = membersSchool[
        memberType
      ].verified.filter((teacher) => teacher.id.toString() !== memberId);
    };
    const removeSchoolFromVerifiedMemberProfile = () => (member.school = "");

    const removeSchoolFromUnverifiedMemberProfile = (schoolCode) => {
      member.school = "";
      member.joinRequest.school = {
        code: schoolCode,
        requestStatus: { processing: false, approved: false },
      };
    };

    if (!membersSchool) {
      return res.status(400).json({ errors: [{ msg: "School not found" }] });
    }
    const memberDetails = {
      name: member.name,
      email: member.email,
      id: member.id,
    };

    // * approve
    if (actionType === "approve") {
      removeMemberFromUnverified(memberId, memberType);
      membersSchool[memberType].verified.push(memberDetails);
      // changing member request status
      member.joinRequest.school = null;
      member.school = membersSchool.schoolCode;
    }
    // * reject
    else if (actionType === "reject") {
      removeMemberFromUnverified(memberId, memberType);
      removeSchoolFromUnverifiedMemberProfile(membersSchool.schoolCode);
    }
    // * block_unverified
    else if (actionType === "block_unverified") {
      membersSchool[memberType].blocked.push(memberDetails);
      removeMemberFromUnverified(memberId, memberType);
      removeSchoolFromUnverifiedMemberProfile(membersSchool.schoolCode);
    }
    // * block_verified
    else if (actionType === "block_verified") {
      {
        membersSchool[memberType].blocked.push(memberDetails);
        removeMemberFromVerified(memberId, memberType);
        removeSchoolFromVerifiedMemberProfile();
        member.school = "";
      }
    }
    // * unblock
    else if (actionType === "unblock") {
      membersSchool[memberType].blocked.forEach((teacher, index) => {
        if (teacher.id.toString() === memberId) {
          membersSchool[memberType].blocked.splice(index, 1);
        }
      });
    }
    // * delete
    else if (actionType === "delete") {
      removeMemberFromVerified(memberId, memberType);
      removeSchoolFromVerifiedMemberProfile();
    } else
      return res.status(400).json({ errors: [{ msg: "Invalid actionType" }] });
    try {
      await membersSchool.save();
      await member.save();

      res.json({
        teachers: membersSchool.teachers,
        students: membersSchool.students,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
