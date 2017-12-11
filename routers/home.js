"use strict";

//==================
// home router
//==================

const Express = require("express");
const router = Express.Router();
const User = require("./../models/User");
const Secret = require("./../models/Secret");
// const models = require("./../models");
// const mongoose = require("mongoose");
// const User = mongoose.models("User");
// const Secret = mongoose.models("Secret");
const {
  createSignedSessionId,
  loginMiddleware,
  loggedInOnly,
  loggedOutOnly
} = require("../services/Session");

// Home route
// 1
router.get("/", loggedInOnly, (req, res) => {
  res.render("welcome/index", { userSecrets: User.secrets });
});

// Login routes
// 2
router.get("/login", loggedOutOnly, (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  // 3
  const { username, password } = req.body;

  User.findOne({ username }, (err, user) => {
    if (!user) return res.send("NO USER");

    // 4
    if (user.validatePassword(password)) {
      const sessionId = createSignedSessionId(username);
      res.cookie("sessionId", sessionId);
      res.redirect("/");
    } else {
      res.send("UNCOOL");
    }
  });
});

// Logout route
router.get("/logout", (req, res) => {
  res.cookie("sessionId", "", { expires: new Date() });
  res.redirect("/");
});

//Post secret route
router.post("/home", (req, res) => {
  const { secret } = req.body;
  const { authorId } = User._id;
  const newSecret = new Secret({ secret, authorId });
  newSecret.save(err => {
    if (err) return res.send("ERROR");
    res.redirect("/home");
  });
  User.secrets.push(newSecret.secretId);
});

module.exports = router;
