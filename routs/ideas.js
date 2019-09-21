const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// auth helpers

const { ensureAuthenticated } = require("../helpers/auth");

// load ideas model
require("../models/Idea");
const Idea = mongoose.model("ideas");

//ideas 'это папка и главный файл в ней будет индекс
router.get("/", ensureAuthenticated, function(req, res) {
  Idea.find({ user: req.user.id })
    .sort({ date: "desc" })
    .then(ideas => {
      res.render("ideas/index", { ideas });
    });
});

router.get("/add", ensureAuthenticated, function(req, res) {
  res.render("ideas/add");
});
// роуты для кнопок редактирования карточки товара

router.get("/edit/:id", ensureAuthenticated, function(req, res) {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    // очень важно проверить при редактировании, не редактируете ли вы чужую задачу.

    if (idea.user != req.user.id) {
      req.flash("error_msg", "Нехуй редактировать чужие задачи"); // редирект на  свою страницу с идеями
      res.redirect("/ideas");
    } else {
      res.render("ideas/edit", {
        idea
      });
    }
  });
});

router.post("/", ensureAuthenticated, function(req, res) {
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
      details,
      user: req.user.id
    };
    new Idea(newUser).save().then(idea => {
      req.flash("success_msg", "Видео идея создана");
      res.redirect("/ideas");
    });
  }
});

// edit form process тк мы не можем отправить из формы пут запрос необходим npm method-override
router.put("/:id", ensureAuthenticated, function(req, res) {
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

router.delete("/:id", ensureAuthenticated, function(req, res) {
  Idea.deleteOne({
    _id: req.params.id
  }).then(() => {
    req.flash("success_msg", "Видео идея удалена");
    res.redirect("/ideas");
  });
});

module.exports = router;
