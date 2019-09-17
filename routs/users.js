const express = require("express");
const router = express.Router();

// user login route

router.get("/login", (req, res) => {
  res.send("login");
});

router.get("/register", (req, res) => {
  res.send("login");
});

module.exports = router;
