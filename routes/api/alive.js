const express = require("express");
const router = express.Router();


router.get("/", (req, res) =>  res.status().send(200));


module.exports = router;
