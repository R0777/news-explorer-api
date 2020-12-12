const Card = require('../models/article');
const ErrorNotFound = require('../errors/errorNotFound');
const ForbiddenError = require('../errors/forbiddenError');

const getArticles = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.status(200).send(cards);
  } catch (error) {
    return next(error);
  }
};

const deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const card = await Card.findOne({ _id: id });
    if (!card) {
      throw new ErrorNotFound('Такой карточки нет');
    }
    if (card.owner === req.user.id) {
      await Card.deleteOne(card);
      return res.status(200).send({ message: 'Карточка удалена' });
    }
    throw new ForbiddenError('Доступ запрещен');
  } catch (error) {
    return next(error);
  }
};

const createArticle = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const ownerId = req.user.id;
    const card = await Card.create({ name, link, owner: ownerId });
    return res.status(200).send(card);
  } catch (error) {
    return next(error);
  }
};
module.exports = {
  getArticles, createArticle, deleteArticle,
};
