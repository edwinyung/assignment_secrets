"use strict";

//==================
// signUp router
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

// Registration Routes
router.get("/", loggedOutOnly, (req, res) => {
  res.render("register");
});

router.post("/", (req, res) => {
  const { username, password } = req.body;

  // Here we create a new user.
  // This virtual password field will automatically hash our password, as we
  // previously discussed.
  const newUser = new User({ username, password });
  newUser.save((err, user) => {
    if (err) return res.send("ERROR");

    // Once the user is created, we create the sessionId and redirect, just as
    // we did in the login POST route
    const sessionId = createSignedSessionId(username);
    res.cookie("sessionId", sessionId);
    res.redirect("/");
  });
});

module.exports = router;
