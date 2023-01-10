const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const config = require("config");
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
router.use(express.static("public"));
const Profile = require("../../models/Profile");
const userFormatter = require("../../utils/userFormatter");
// Variables for form validation
const USERTYPES = ["student", "teacher", "clubLeader", "other", "school_admin"];

// --------------------------------------->

// * route POST api/auth/registration
// * desc Save the registration data
// * access Public
// * Testing: Passed ✔ (20-03-2022)

router.post(
  "/registration",
  [
    check("userName", "Please enter a valid name")
      .not()
      .isEmpty()
      .isLength({ max: 40 }),
    check("userEmail", "Please enter a valid email")
      .isEmail()
      .isLength({ max: 40 }),
    check("userPass", "Please enter a valid password").isLength({
      min: 6,
      max: 40,
    }),
    check("userPassConfirm", "Please enter a valid password").isLength({
      min: 6,
      max: 40,
    }),
  ],
  async (req, res) => {
    let errorArray = validationResult(req).array();
    if (req.body.userPass !== req.body.userPassConfirm)
      errorArray.push({
        location: "body",
        param: "password",
        msg: "Passwords do not match",
      });
    if (!USERTYPES.includes(req.body.userType))
      errorArray.push({
        location: "body",
        param: "userType",
        msg: "Please enter a valid user type",
      });

    if (errorArray.length) {
      return res.json({ errors: errorArray });
    }
    const { userName, userEmail, userType, userPass } = req.body;

    try {
      let user = await User.findOne({ email: userEmail });
      if (user) {
        return res.json({
          errors: [
            {
              location: "body",
              param: "userEmail",
              msg: "Email already registered",
            },
          ],
        });
      }
      user = new User({
        name: userName,
        email: userEmail,
        password: userPass,
        type: userType,
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();
      let profile = new Profile({
        user: user.id,
        meetingName: "",
        labeledDescriptors: "",
      });
      await profile.save();

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        "3G^BdE*x4fNMtKZgo15!skX3cduf7XNnm#Z7p*tT7XlSIgy6ztJnzqnmn%GrPGR635H2mci8gYeZLs#hTCciAnm%bxz39&NwRM!",
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          return res.json({ token, user: userFormatter(user) });
        }
      );
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

// * route   GET api/auth
// * desc    Get data of logged in user
// * access  Private
// * Testing: Passed ✔ (20-03-2022)

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    return res.json(userFormatter(user));
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

// --------------------------------------->

// * route   POST api/auth/login
// * desc    Login user and get token
// * access  Public
// * Testing Passed ✔ (20-03-2022)

router.post(
  "/login",
  [
    check("userEmail", "Please enter a valid email")
      .isEmail()
      .isLength({ max: 40 }),
    check("userPass", "Password is required").exists(),
  ],
  async (req, res) => {
    let errorArray = validationResult(req).array();
    if (errorArray.length) {
      return res.status(400).json({ errors: errorArray });
    }
    const { userEmail, userPass } = req.body;

    try {
      let user = await User.findOne({ email: userEmail });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(userPass, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        "3G^BdE*x4fNMtKZgo15!skX3cduf7XNnm#Z7p*tT7XlSIgy6ztJnzqnmn%GrPGR635H2mci8gYeZLs#hTCciAnm%bxz39&NwRM!",
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          return res.json({ token, user: userFormatter(user) });
        }
      );
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
