const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
//load routs
const ideas = require("./routs/ideas");
const users = require("./routs/users");

const PORT = 5000;

// server part
const app = express();
// mongoose
mongoose.Promise = global.Promise; // почитать!!
mongoose
  .connect("mongodb://localhost/vidjot-dev", {
    // useMongoClient: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("db connected..");
  })
  .catch(err => console.log(err));

// load ideas model
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
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);
app.use(flash());
//Для флеш сообщений необходимы глобальные переменные
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  // Нижняя locals.error нужна для паспорта
  res.locals.error = req.flash("error");
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
