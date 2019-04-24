const mongoose = require('mongoose');
const config = require('config');
const logger = require('../util/logger')

module.exports = function () {
    const db = config.get('db');
    mongoose.connect(db, {useNewUrlParser: true})
        .then(() => {
                logger.log({
                    level: 'info',
                    message: `Connected to ${db}...`
                });
            }
        );
};