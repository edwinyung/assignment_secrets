// models/User.js

// 1
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');

// 2
const UserSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
});

UserSchema.plugin(uniqueValidator);

// 3
UserSchema.virtual('password').set(function(value) {
  this.passwordHash = bcrypt.hashSync(value, 8); // the 8 here is the "cost factor"
});

// 4
UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

// 5
const User = mongoose.model('User', UserSchema);

module.exports = User;
