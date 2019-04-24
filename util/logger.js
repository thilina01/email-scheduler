const { createLogger, format, transports } = require('winston');
const { combine, timestamp, json } = format;

module.exports = createLogger({
    format: combine(
        timestamp(),
        json()
    ),
    transports: [
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' }),
        new transports.Console(),
    ]
});