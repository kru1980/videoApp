var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  debugger;
  req.flash("info", "Привет Родик");
  console.log("flash=", req);

  res.render("index", { title: "Express World" });
});

router.post("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
