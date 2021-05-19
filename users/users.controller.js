const express = require("express");
const router = express.Router();
const userService = require("./user.service");
const roleMiddleware = require('../_helpers/roleMiddleware')

// routes

//Auditor routes
router.get("/audit", roleMiddleware, getAllUsersWithLogTime);

router.post("/authenticate", authenticate);
router.post("/register", register);
router.post("/logout", logout);
router.get("/", getAll);
router.get("/current", getCurrent);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", _delete);



module.exports = router;

function authenticate(req, res, next) {
  const clientIP = req.connection.remoteAddress;
  userService
    .authenticate(req.body, clientIP)
    .then((user) =>
      user
        ? res.json(user)
        : res.status(400).json({ message: "Username or password is incorrect" })
    )
    .catch((err) => next(err));
}

async function logout(req, res, next) {
  const userLogTimeId = req.body.userLogTimeId;
  userService
      .logOut(userLogTimeId).then(resulsts => {
    return res.status(200).json({message:"Logout Successful"})
  }).catch((err) => next(err));
}

function register(req, res, next) {
  userService
    .create(req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function getAll(req, res, next) {
  userService
    .getAll()
    .then((users) => res.json(users))
    .catch((err) => next(err));
}

function getCurrent(req, res, next) {
  userService
    .getById(req.user.sub)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function getById(req, res, next) {
  userService
    .getById(req.params.id)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function update(req, res, next) {
  userService
    .update(req.params.id, req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function _delete(req, res, next) {
  userService
    .delete(req.params.id)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

/* Get users with logTime */

function getAllUsersWithLogTime(req, res, next){
  // if (req.user.role !== "Auditor") {
  //   res.status(401).json({ error: "Unauthorized!" });
  // } else {
  // console.log(req)
    userService
        .getAllUsersWithLogTime()
        .then((users) => res.json(users))
        .catch((err) => next(err));
  // }
}
