const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
//load routs
const ideas = require("./routs/ideas");
const users = require("./routs/users");

// passport config
require("./config/passport")(passport);
// db config

const db = require("./config/db");

const PORT = process.env.PORT || 5000;

// server part
const app = express();
// mongoose
mongoose.Promise = global.Promise; // почитать!!
mongoose
  .connect(db.mongoURI, {
    // useMongoClient: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("db connected..");
  })
  .catch(err => console.log(err));

// load ideas model удалить с этой страницы
require("./models/Idea");
const Idea = mongoose.model("ideas");

// middleware
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// static folder
app.use(express.static(path.join(__dirname, "public")));

app.use(methodOverride("_method"));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Для флеш сообщений необходимы глобальные переменные
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  // Нижняя locals.error нужна для паспорта
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});
app.use("/ideas", ideas);
app.use("/users", users);

// middleware end

// Routs

app.get("/", function(req, res) {
  const title = "Welcome";
  res.render("index", { title });
});
app.get("/about", function(req, res) {
  res.render("about");
});

// ========

app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
