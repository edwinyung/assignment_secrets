"use strict";

//==================
// home router
//==================

const Express = require("express");
const router = Express.Router();
const User = require("../models/User");
const {
  createSignedSessionId,
  loginMiddleware,
  loggedInOnly,
  loggedOutOnly
} = require("../services/Session");

// Home route
// 1
router.get("/", loggedInOnly, (req, res) => {
  res.render("welcome/index");
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

module.exports = router;
