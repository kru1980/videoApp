const LocalStrategy = require("passport-local").Strategy;
const User = require("../dbs/model/modelUser");
const passport = require("passport");
const bcrypt = require("bcrypt");

module.exports = function (passport) {
  return passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // find user in db
      User.findOne({ email }).then((user) => {
        if (!user) {
          return done(null, false, {
            message: "Пользователь не зарегестрирован",
          });
        }

        bcrypt.compare(password, user.password, (err, isMath) => {
          if (err) throw err;
          if (isMath) {
            return done(null, user);
          }
          if (!isMath) {
            return done(null, false, { message: "Пароль не верен" });
          }
        });
      });
      passport.serializeUser(function (user, done) {
        done(null, user.id);
      });

      passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
          done(err, user);
        });
      });
    })
  );
};
