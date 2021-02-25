const mongoose = require('mongoose');
const uniqueValidatr = require("mongoose-unique-validator")
const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true}, // here unique is not validator unlike required which is validator
  password: {type: String, required: true}
})

userSchema.plugin(uniqueValidatr)         // this is a plugin supported by mongoose which will then check unique email validation
module.exports = mongoose.model("User", userSchema)
