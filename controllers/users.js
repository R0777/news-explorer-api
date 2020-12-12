const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/badRequestError');
const NotAuthorizeError = require('../errors/notAuthorizeError');
const ErrorNotFound = require('../errors/errorNotFound');
const NotAllowToCreateUser = require('../errors/notAllowToCreateUser');

const { JWT_SECRET } = process.env;

const User = require('../models/user');

const getMe = async (req, res, next) => {
  try {
    const { id } = req.user;
    if (!id) {
      throw new BadRequestError('Что-то не так с запросом');
    }
    const user = await User.findOne({ _id: id });
    if (!user) {
      throw new ErrorNotFound('Пользователь не найден');
    }
    return res.status(200).send({ name: user.name, email: user.email });
  } catch (error) {
    return next(error);
  }
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Что-то не так с запросом');
  }
  return User.findOne({ email }).select('+password')
    .then((admin) => {
      if (!admin) {
        throw new NotAuthorizeError('Невалидные данные');
      }
      return bcrypt.compare(password, admin.password)
        .then((matched) => {
          if (matched) {
            const token = jwt.sign({
              id: admin._id,
              email: admin.email,
              name: admin.name,
            }, JWT_SECRET);
            return res.status(200).send({ token });
          }
          throw new NotAuthorizeError('Невалидные данные');
        });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    throw new BadRequestError('Невалидные данные');
  }
  return User.findOne({ email }).select('+password')
    .then((admin) => {
      if (admin) {
        throw new NotAllowToCreateUser('Такой пользователь уже есть в БД');
      }
      return bcrypt.hash(password, 10)
        .then((hash) => User.create({ name, email, password: hash }))
        .then(({ _id }) => {
          res.status(200).send({ _id });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  createUser, getMe, login,
};
