const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const Email = mongoose.model('Email', new mongoose.Schema({
  to: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 150
  },
  subject: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100
  },
  content: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 200
  },
  status: {
    type: String,
    enum : ['SENT','QUEUED','FAILED'],
    required: true,
  },
}));

function validateEmail(email) {
  const schema = {
    to: Joi.string().min(6).max(150).required(),
    subject: Joi.string().min(5).max(100).required(),
    content: Joi.string().min(5).max(200).required()
  };

  return Joi.validate(email, schema);
}

exports.Email = Email;
exports.validate = validateEmail;