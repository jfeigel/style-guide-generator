const Winston = require('winston');

module.exports = Winston.createLogger({
  format: Winston.format.combine(
    Winston.format.colorize(),
    Winston.format.splat(),
    Winston.format.simple()
  ),
  transports: [
    new Winston.transports.File({ filename: 'error.log', level: 'error' }),
    new Winston.transports.File({ filename: 'combined.log', level: 'silly' }),
    new Winston.transports.Console({ level: process.env.LOG_LEVEL || 'info' })
  ]
});