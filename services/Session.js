// /services/Session.js

//generate signed sessionId
const SECRET = process.env['secret'] || 'puppies';
const md5 = require('md5');

const createSignedSessionId = username => {
  return `${username}:${generateSignature(username)}`;
};

const generateSignature = username => md5(username + SECRET);

//validare and retrieve user from sessionId
const User = require('../models/User');

const loginMiddleware = (req, res, next) => {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) return next();

  const [username, signature] = sessionId.split(':');

  User.findOne({ username }, (err, user) => {
    if (signature === generateSignature(username)) {
      req.user = user;
      res.locals.currentUser = user;
      next();
    } else {
      res.send("You've tampered with your session!");
    }
  });
};

//protect routes (authorization)

const loggedInOnly = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('login');
  }
};

const loggedOutOnly = (req, res, next) => {
  if (!req.user) {
    next();
  } else {
    res.redirect('/');
  }
};

module.exports = {
  createSignedSessionId,
  loginMiddleware,
  loggedOutOnly,
  loggedInOnly
};
