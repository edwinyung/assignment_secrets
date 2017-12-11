const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  secrets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Secret" }]
});

UserSchema.plugin(uniqueValidator);

UserSchema.virtual("password").set(function(value) {
  this.passwordHash = bcrypt.hashSync(value, 8); // the 8 here is the "cost factor"
});

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
