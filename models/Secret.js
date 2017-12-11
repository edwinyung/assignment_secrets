const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");

const SecretSchema = mongoose.Schema(
  {
    secret: { type: String, required: true },
    authorId: mongoose.Schema.Types.ObjectId,
    requestUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    approvedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  {
    timestamps: true
  }
);

SecretSchema.plugin(uniqueValidator);

const Secret = mongoose.model("Secret", SecretSchema);

module.exports = Secret;
