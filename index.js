const express = require('express');
const app = express();
const logger = require('./util/logger')

require('./startup/routes')(app);
require('./startup/db')();
require('./startup/scheduler')();

const port = process.env.PORT || 2010;
const server = app.listen(port, () => {
        logger.log({
            level: 'info',
            message: `Listening on port ${port}...`
        });
    }
);

module.exports = server;
