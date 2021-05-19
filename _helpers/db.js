const config = require("config.js");
const mongoose = require("mongoose");
console.log(config)
mongoose.connect(process.env.MONGODB_URI || config.connectionString, {
  useCreateIndex: true,
  useNewUrlParser: true,
});
mongoose.Promise = global.Promise;

module.exports = {
  User: require("../users/user.model"),
  UserLogTime: require("../users/userLogTime.model"),
};
