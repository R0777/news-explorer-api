const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
    minlength: 2,
  },
  title: {
    type: String,
    required: true,
    minlength: 2,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        const regex = /^https?:\/\/(www\.)?(([\w#!:.?+=&%@!\-/])*)?\.(([\w#!:.?+=&%@!\-/])*)?#?/gi;
        const str = v;
        return regex.test(str);
      },
      message: 'Укажите корректную ссылку',
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        const regex = /^https?:\/\/(www\.)?(([\w#!:.?+=&%@!\-/])*)?\.(([\w#!:.?+=&%@!\-/])*)?#?/gi;
        const str = v;
        return regex.test(str);
      },
      message: 'Укажите ссылку на изображение',
    },
  },
  owner: {
    type: String,
    ref: 'user',
    required: true,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},
{
  versionKey: false,
});

module.exports = mongoose.model('article', articleSchema);
