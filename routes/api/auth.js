// when routes in sepasrate files we use express routing
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
//JWT docs https://jwt.io/introduction/
const jwt = require("jsonwebtoken");
const config = require("config");

// @route    GET api/auth
// @desc     test route
// @access   Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
  "/",
  [
    check("email", "please connect an email to continue").isEmail(),
    check("password", "please enter password").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    //if there are errors..
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      // Check user exists -> error
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "invalid login details" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "invalid login details" }] });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtsecret"),
        //expiration of jwt to change
        { expiresIn: 36000 },
        (err, token) => {
          //check for error otherwise send token to client
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {y
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
