// when routes in sepasrate files we use express routing
const express = require("express");
const router = express.Router();

// @route    GET api/users
// @desc     test route
// @access   Public
router.get("/", (req, res) => res.send("User Route"));

module.exports = router;
