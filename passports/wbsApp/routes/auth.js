const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");


//login
router.get("/login", function (req, res, next) {
  res.render("login", { title: "Login Page" });
});

router.post('/login',
passport.authenticate('local', { successRedirect: '/',
                                 failureRedirect: '/auth/login',
                                 failureFlash: true })
);

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

//register
router.get("/register", function (req, res, next) {
  res.render("register", { title: "Register Page" });
});

router.post("/register", async function (req, res, next) {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
    });
    res.redirect("/auth/login");
  } catch (error) {
    console.error(error);
    res.redirect("/auth/register");
  }
});

module.exports = router;
