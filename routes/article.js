const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getArticles, createArticle, deleteArticle,
} = require('../controllers/articles');

router.get('/articles', getArticles);

router.post('/articles', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    link: Joi.string().required().pattern(/^https?:\/\/(www\.)?(([\w#!:.?+=&%@!\-/])*)?\.(([\w#!:.?+=&%@!\-/])*)?#?/),
  }),
}), createArticle);

router.delete('/articles/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }),
}), deleteArticle);

module.exports = router;
