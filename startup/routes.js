const express = require('express');
const emails = require('../routes/emails');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use('/v1/emails', emails);
  app.use(error);
};