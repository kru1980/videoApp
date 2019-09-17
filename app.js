const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const PORT = 5000;

// server part
const app = express();
// mongoose
mongoose.Promise = global.Promise;
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

// middleware end

// Routs

app.get("/", function(req, res) {
  const title = "Welcome";
  res.render("index", { title });
});
app.get("/about", function(req, res) {
  res.render("about");
});

app.get("/ideas/add", function(req, res) {
  res.render("ideas/add");
});
// роуты для кнопок редактирования карточки товара
app.get("/ideas/edit/:id", function(req, res) {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    console.log("idea", idea);

    res.render("ideas/edit", {
      idea
    });
  });
});

//ideas 'это папка и главный файл в ней будет индекс
app.get("/ideas", function(req, res) {
  Idea.find({})
    .sort({ date: "desc" })
    .then(ideas => {
      res.render("ideas/index", { ideas });
    });
});
app.post("/ideas", function(req, res) {
  // форма отправляет запрос пост на роут /ideas,  где пройдет добавление идеи в список
  let errors = [];
  const { title, details } = req.body;
  if (!title) {
    errors.push({ text: "Добавте заголовок идеи" });
  }
  if (!details) {
    errors.push({ text: "Добавте описание вашей идеи" });
  }
  // если есть ошибки при заполнении формы вернуться на страницу формы, передав ошибки, и  правильно заполненные поля из req.body
  if (errors.length > 0) {
    res.render("ideas/add", { title, details, errors });
  } else {
    const newUser = {
      title,
      details
    };
    new Idea(newUser).save().then(idea => {
      req.flash("success_msg", "Видео идея создана");
      res.redirect("/ideas");
    });
  }
});

// edit form process тк мы не можем отправить из формы пут запрос необходим npm method-override
app.put("/ideas/:id", function(req, res) {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    // update
    idea.title = req.body.title;
    idea.details = req.body.details;
    idea.save().then(idea => {
      req.flash("success_msg", "Видео идея изменена");
      res.redirect("/ideas");
    });
  });
});

app.delete("/ideas/:id", function(req, res) {
  Idea.deleteOne({
    _id: req.params.id
  }).then(() => {
    req.flash("success_msg", "Видео идея удалена");
    res.redirect("/ideas");
  });
});

app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
