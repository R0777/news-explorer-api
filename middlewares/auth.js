const jwt = require('jsonwebtoken');
const NotAuthorizeError = require('../errors/notAuthorizeError');

const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NotAuthorizeError('Необходима авторизация');
  }

  try {
    const token = authorization.replace('Bearer ', '');
    if (!token) {
      throw new NotAuthorizeError('Необходима авторизация');
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (e) {
      throw new NotAuthorizeError('Необходима авторизация');
    }

    return next();
  } catch (error) {
    return next(error);
  }
};
