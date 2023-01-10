const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
router.use(express.static("public"));
const Profile = require("../../models/Profile");

// -------------------------------------------------->

// * route GET api/profile/me
// * desc Get the profile of user
// * access Private
// * Testing: Passed ✔ (26-03-2022)

router.get('/me', auth, async (req, res) => {
    try {
        const user = await Profile.findOne({ user: req.user.id }, {_id: 0,__v:0 })  
        return res.json(user);
    } catch (err) {

        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

// -------------------------------------------------->

// * route POST api/profile/update
// * desc Save the profile of user
// * access Private
// * Testing: Passed ✔ (20-03-2022)


router.post(
    "/update", auth, async (req, res) => {

        let errorArray = validationResult(req).array();
        if (errorArray.length) {
            return res.json({ errors: errorArray });

        }
        const { meetingName, labeledDescriptors } = req.body;

        try {
            let userExists = await Profile.findOne({ user: req.user.id });
            if (!userExists)
                return res.status(400).json({ errors: [{ msg: "User does not exist" }] });


            let profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                {
                    meetingName,
                    labeledDescriptors,
                },
                { new: true }
            );

            return res.json(profile);

        } catch (err) {
            console.error(err.message);
            return res.status(500).send("Server Error");
        }
    }
);

module.exports = router;
