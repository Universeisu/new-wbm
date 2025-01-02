const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/user.controller");
const authJwt = require("../middlewares/authJwt.middleware")


//http://localhost:5000/api/v1/auth/register (Path)
router.post("/register", userControllers.register);
//http://localhost:5000/api/v1/auth/login (Path)
router.post("/login", userControllers.login);

module.exports = router;
