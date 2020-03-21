/**
 * @module db
 * @category Backend
 * @requires logger
 */
import config from '../config';
import logger from '../logger';

import mongoose from 'mongoose';

const url = config.site.db.url;
const dbName = config.site.db.name;

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

let connection;

/**
 * Custom MongoDBError
 *
 * @typedef {Error} MongoDBError
 */

/**
 * Construct the custom MongoDB Error
 *
 * @param {string} message Error message
 */
function MongoDBError(message) {
  this.name = 'MongoDBError';
  this.message = message || '';
}
MongoDBError.prototype = Error.prototype;

/**
 * Connect to the MongoDB
 *
 * @async
 * @function
 * @throws {MongoDBError} MongoDB Error
 * @returns {boolean} If connection is successful
 */
export const connect = async function connect() {
  try {
    await mongoose.connect(`mongodb://${url}/${dbName}`, mongoOptions);
    connection = mongoose.connection;
    logger.info(`DB: Connect to [${dbName}] succeeded`);
    return true;
  } catch (err) {
    throw new MongoDBError(`DB: Connect to [${dbName}] failed`);
  }
};

/**
 * Connect to the MongoDB
 *
 * @async
 * @function
 * @throws {MongoDBError} MongoDB Error
 * @returns {Promise} If connection is successful
 */
export const disconnect = async function disconnect() {
  try {
    return await connection.close();
  } catch (err) {
    throw new MongoDBError(`DB: Disconnect from [${dbName}] failed`);
  }
};
