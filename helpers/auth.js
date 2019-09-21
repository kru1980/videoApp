module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    req.flash("error_msg", "У вас нет прав доступа");
    res.redirect("/users/login");
  },

  helloRodik: (req, res) => {
    console.log("hello from helpers");
  }
};
