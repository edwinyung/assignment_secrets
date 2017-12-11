"use strict";

let mongoose = require("mongoose");
let bluebird = require("bluebird");

mongoose.Promise = bluebird;

let models = {};

models.User = require("./User");
models.Secret = require("./Secret");

module.exports = models;
