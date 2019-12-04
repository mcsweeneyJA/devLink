// when routes in sepasrate files we use express routing
const express = require("express");
const router = express.Router();
//documentation: https://express-validator.github.io/docs/
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
//JWT docs https://jwt.io/introduction/
const jwt = require("jsonwebtoken");
const config = require("config");

const User = require("../../models/User");

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  "/",
  [
    check("name", "dont forget to enter your name!")
      .not()
      .isEmpty(),
    check("email", "please connect an email to continue").isEmail(),
    check("password", "please enter a password > 6 characters").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    //if there are errors..
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      // Check user exists -> error
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "this user already exists" }] });
      }

      // Get user gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });
      // Encrypt password
      //creates new instance of user - doesnt save
      user = new User({
        name,
        email,
        avatar,
        password
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // return Jsonwebtoken

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
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
