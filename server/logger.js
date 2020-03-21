/**
 * @module logger
 * @category Backend
 */
import {
  createLogger,
  format as _format,
  transports as _transports
} from 'winston';

export default createLogger({
  format: _format.combine(
    _format.colorize(),
    _format.splat(),
    _format.simple()
  ),
  transports: [
    new _transports.File({ filename: 'error.log', level: 'error' }),
    new _transports.File({ filename: 'combined.log', level: 'silly' }),
    new _transports.Console({ level: process.env.LOG_LEVEL || 'info' })
  ]
});
