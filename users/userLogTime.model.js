const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  users: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  logInTime: { type: Date,  default: Date.now() },
  logOutTime: { type: Date },
  ipAddress: { type: String, default: null },
});

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("UserLogTime", schema);
