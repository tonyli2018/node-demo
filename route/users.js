const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../model/user");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("config");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", auth, async (req, res) => {
  console.log("body::" + req.body);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  //console.log("user::" +)const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, 10);
  await user.save();

  // const token = user.generateAuthToken();
  res
    //.header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

router.post("/login", async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      console.log(user);
      const token = jwt.sign(
        {
          user_id: user._id,
          email,
        },
        config.get("TOKEN_KEY"),
        {
          expiresIn: "2h",
        }
      );

      // save user token
      // user.token = token;

      // user
      // res.status(200).json(user);
      res.status(200).send(token);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
