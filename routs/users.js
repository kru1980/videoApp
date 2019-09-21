const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");

// load user model
require("../models/User");
const User = mongoose.model("users");
// user login route

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.get("/register", (req, res) => {
  res.render("users/register");
});

// login form POSt

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/ideas",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

// register form POSt
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  console.log(name, email, password, password2);

  let errors = [];
  if (password != password2) {
    errors.push({ text: "Пароли не совпадают" });
  }

  if (password.length < 4) {
    errors.push({ text: "Пароль менее 4 символов" });
  }

  if (errors.length > 0) {
    res.render("users/register", { errors, name, email, password, password2 });
  } else {
    // Проверка, зареган пользователь или нет

    User.findOne({ email }).then(user => {
      if (user) {
        req.flash("error_msg", "Пользователь уже зареган");
        res.redirect("/users/login");
      } else {
        const newUser = new User({
          name,
          email,
          password
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash("success_msg", "Вы зарегестрированы и можете войти");
                res.redirect("/users/login");
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
      }
    });
  }
});

// logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "Вы успешно вышли из приложения");
  res.redirect("/users/login");
});

module.exports = router;
