const config = require("config.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("_helpers/db");
const { UserLogTime } = require("../_helpers/db");
const User = db.User;

module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  getAllUsersWithLogTime,
  logOut
};

async function authenticate({ username, password }, clientIP) {
  const user = await User.findOne({ username });

  if (user && bcrypt.compareSync(password, user.hash)) {
    const { hash, ...userWithoutHash } = user.toObject();

    const token = jwt.sign({ sub: user.id,role:user.role }, config.secret);

    const userLogTime = new UserLogTime({
      users: user,
      logInTime: Date.now(),
      ipAddress: clientIP,
    });

    await userLogTime.save().catch((err) => console.log("Error", err));

    return {
      ...userWithoutHash,
      token,
      userLogTimeId: userLogTime._id
    };
  }
}

async function getAll() {
  return await User.find().select("-hash");
}

async function getAllUsersWithLogTime() {
  return await UserLogTime.find().sort('-logInTime').populate("users");
}

async function getById(id) {
  return await User.findById(id).select("-hash");
}

async function create(userParam) {
  // validate
  if (await User.findOne({ username: userParam.username })) {
    throw 'Username "' + userParam.username + '" is already taken';
  }

  const user = new User(userParam);

  // hash password
  if (userParam.password) {
    user.hash = bcrypt.hashSync(userParam.password, 10);
  }

  // save user
  await user.save();
}

async function update(id, userParam) {
  const user = await User.findById(id);

  // validate
  if (!user) throw "User not found";
  if (
    user.username !== userParam.username &&
    (await User.findOne({ username: userParam.username }))
  ) {
    throw 'Username "' + userParam.username + '" is already taken';
  }

  // hash password if it was entered
  if (userParam.password) {
    userParam.hash = bcrypt.hashSync(userParam.password, 10);
  }

  // copy userParam properties to user
  Object.assign(user, userParam);

  await user.save();
}

async function _delete(id) {
  await User.findByIdAndRemove(id);
}

async function logOut(logId) {
  await UserLogTime.findByIdAndUpdate(logId,{logOutTime:Date.now()})
}
