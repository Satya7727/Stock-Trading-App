const { model } = require("mongoose");

const { userSchema } = require("../schemas/UserSchema");

const UserModel = new model("User", userSchema);

module.exports = { UserModel };