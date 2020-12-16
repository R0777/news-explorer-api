require('dotenv').config();
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const mongoose = require('mongoose');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const article = require('./routes/article.js');
const users = require('./routes/users.js');
const auth = require('./middlewares/auth');
const ErrorNotFound = require('./errors/errorNotFound');
const { createUser, login } = require('./controllers/users');

const { PORT = 3000, BASE } = process.env;
const app = express();
app.use(helmet());

mongoose.connect(BASE, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
  }),
}), createUser);

app.use(auth);
app.use('/', users);
app.use('/', article);
app.use('/', () => {
  throw new ErrorNotFound('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });

  next();
});

app.listen(PORT, () => {
  console.log(`Working on port ${PORT}`);
});
