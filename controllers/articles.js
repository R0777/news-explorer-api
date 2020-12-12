const Article = require('../models/article');
const ErrorNotFound = require('../errors/errorNotFound');
const ForbiddenError = require('../errors/forbiddenError');

const getArticles = async (req, res, next) => {
  const { id } = req.user;
  try {
    const articles = await Article.find({ owner: id });
    return res.status(200).send(articles);
  } catch (error) {
    return next(error);
  }
};

const deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await Article.findOne({ _id: id });
    if (!article) {
      throw new ErrorNotFound('Такой новости нет');
    }
    if (article.owner === req.user.id) {
      await Article.deleteOne(article);
      return res.status(200).send({ message: 'Новость удалена' });
    }
    throw new ForbiddenError('Доступ запрещен');
  } catch (error) {
    return next(error);
  }
};

const createArticle = async (req, res, next) => {
  try {
    const {
      keyword, title, text, date, source, link, image,
    } = req.body;
    const ownerId = req.user.id;
    const card = await Article.create({
      keyword, title, text, date, source, link, image, owner: ownerId,
    });
    return res.status(200).send(card);
  } catch (error) {
    return next(error);
  }
};
module.exports = {
  getArticles, createArticle, deleteArticle,
};
