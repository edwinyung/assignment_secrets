'use strict';

//==================
// home router
//==================

const Express = require('express');
const router = Express.Router();
const mongoose = require('mongoose');
const models = require('./../models');
var Secret = mongoose.model('Secret');
var User = mongoose.model('User');

const {
  createSignedSessionId,
  loginMiddleware,
  loggedInOnly,
  loggedOutOnly
} = require('../services/Session');

// Home route
// 1
router.get('/', loggedInOnly, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('secrets');
    const secretArray = [];
    for (let i = 0; i < user.secrets.length; i++) {
      if (user.id === user.secrets[i].authorId) {
        secretArray.push({
          secret: user.secrets[i].secret,
          username: user.username
        });
      }
    }
    console.log(user);
    // const secretArray = [];
    // const userArray = [];
    // for (let i = 0; i < req.user.secrets.length; i++) {
    //   let secret = await Secret.findById(req.user.secrets[i]);
    //   let secretContent = secret.secret;
    //   let secretUser = secret.authorId;
    //   secretArray.push(secretContent);
    //   userArray.push(secretUser);
    // }
    // let currentUsername = req.user.username;
    res.render('welcome/index', {
      userSecrets: secretArray,
      username1: currentUsername
    });
  } catch (e) {
    next(e);
  }
});

// Login routes
// 2
router.get('/login', loggedOutOnly, (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  // 3
  const { username, password } = req.body;

  User.findOne({ username }, (err, user) => {
    if (!user) return res.send('NO USER');

    // 4
    if (user.validatePassword(password)) {
      const sessionId = createSignedSessionId(username);
      res.cookie('sessionId', sessionId);
      res.redirect('/');
    } else {
      res.send('UNCOOL');
    }
  });
});

// Logout route
router.get('/logout', (req, res) => {
  res.cookie('sessionId', '', { expires: new Date() });
  res.redirect('/');
});

//Post secret route
router.post('/', async (req, res) => {
  try {
    const secret = req.body.secret;
    const authorId = req.user.id;
    const newSecret = new Secret({ secret, authorId });
    await newSecret.save();
    const user = await User.findById(authorId);
    if (!user) return res.send('NO USER');
    user.secrets.push(newSecret.id); //push secret to user's array
    await user.save();
    res.redirect('/');
  } catch (e) {
    next(e);
  }
});

module.exports = router;
