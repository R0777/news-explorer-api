const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: (props) => `${props.value} Укажите корректный email`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    select: false,
  },
},
{
  versionKey: false,
});

module.exports = mongoose.model('user', userSchema);
