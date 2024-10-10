const mongoose = require("mongoose");
const PLM = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    Email:String,
});
UserSchema.plugin(PLM);

module.exports = mongoose.model("USer",UserSchema);