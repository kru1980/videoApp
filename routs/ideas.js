const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// load ideas model
require("../models/Idea");
const Idea = mongoose.model("ideas");

//ideas 'это папка и главный файл в ней будет индекс
router.get("/", function(req, res) {
  Idea.find({})
    .sort({ date: "desc" })
    .then(ideas => {
      res.render("ideas/index", { ideas });
    });
});

router.get("/add", function(req, res) {
  res.render("ideas/add");
});
// роуты для кнопок редактирования карточки товара
router.get("/edit/:id", function(req, res) {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    console.log("idea", idea);

    res.render("ideas/edit", {
      idea
    });
  });
});

router.post("/", function(req, res) {
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
router.put("/:id", function(req, res) {
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

router.delete("/:id", function(req, res) {
  Idea.deleteOne({
    _id: req.params.id
  }).then(() => {
    req.flash("success_msg", "Видео идея удалена");
    res.redirect("/ideas");
  });
});

module.exports = router;
