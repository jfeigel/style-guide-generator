/**
 * @module UserModel
 * @category Backend
 */
import * as bcrypt from 'bcryptjs';
import { model, Schema } from 'mongoose';
import merge from 'deepmerge';
import _ from 'lodash';

const base = {
  providers: {
    google: null,
    github: null
  },
  email: null,
  password: null,
  firstName: null,
  lastName: null,
  displayName: null,
  avatar: null
};

const UserSchema = new Schema({
  providers: {
    google: String,
    github: String
  },
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  displayName: String,
  avatar: String
});
const UserModel = model('User', UserSchema);

/**
 * Gets a User document by searching by the email
 *
 * @async
 * @function
 * @instance
 * @param {string} email email to search for
 * @param {boolean=} removePassword If password should be removed from results
 * @returns {Promise<object>} User document
 */
export const getByEmail = async function getByEmail(
  email,
  removePassword = true
) {
  if (removePassword) {
    return await UserModel.findOne({ email }, '-password').exec();
  }

  return await UserModel.findOne({ email }).exec();
};

/**
 * Creates or updates a User document
 *
 * @async
 * @function
 * @instance
 * @param {object} user User data
 * @param {boolean=} isRegister If the caller is from the Register function
 * @returns {Promise<object>} new User document
 */
export const create = async function create(user, isRegister = false) {
  if (user.password) {
    user.password = encryptPassword(user.password);
  }

  const condition = {};
  condition.email = user.email;

  // Remove extra props from mongoose document
  let existingUser = await UserModel.findOne(condition).exec();
  if (existingUser && isRegister) {
    return {
      error: true,
      status: 400,
      message: 'Email already exists'
    };
  }

  // Only take the base props
  existingUser = existingUser
    ? _.pick(existingUser.toObject(), _.keys(base))
    : base;

  // Deep merge the user data
  const newUser = merge(existingUser, user);

  // Add back MongoDB props if updating an existing user
  if (existingUser && existingUser._id) {
    newUser._id = existingUser._id;
    newUser.__v = existingUser.__v;
  }

  await UserModel.replaceOne(condition, newUser, {
    upsert: true
  }).exec();

  return await getByEmail(newUser.email);
};

/**
 * Gets a User document
 *
 * @async
 * @function
 * @instance
 * @param {string} id id to search for
 * @returns {Promise<object>} User document
 */
export const getById = async function getById(id) {
  return await UserModel.findById(id, '-password').exec();
};

/**
 * Gets a User document by searching by the provider and provider id
 *
 * @async
 * @function
 * @instance
 * @param {string} provider provider to search for
 * @param {string} id provider id to search for
 * @returns {Promise<object>} User document
 */
export const getByProviderId = async function getByProviderId(provider, id) {
  const condition = {};
  condition[`providers.${provider}`] = id;
  return await UserModel.findOne(condition, '-password').exec();
};

/**
 * Authenticate a user
 *
 * @async
 * @function
 * @instance
 * @param {string} username username to search for
 * @param {string} password password to validate
 * @returns {object} User document or error message
 */
export const authenticate = async function authenticate(username, password) {
  let user = await getByEmail(username, false);
  if (!user) {
    return {
      status: 401,
      message: 'User not found'
    };
  }

  user = user.toObject();

  if (!user.password) {
    return {
      status: 400,
      message: 'Password not set. Try logging in with the social buttons.'
    };
  }

  if (!comparePassword(password, user.password)) {
    return {
      status: 401,
      message: 'Incorrect password'
    };
  }

  delete user.password;

  return {
    user
  };
};

/**
 * Encrypt a password string
 *
 * @private
 * @function
 * @instance
 * @param {string} password password string to encrypt
 * @returns {string} encrypted password string
 */
function encryptPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(12));
}

/**
 * Validates a password
 *
 * @private
 * @function
 * @instance
 * @param {string} enteredPass password string to validate
 * @param {string} savedPass password string to validate against
 * @returns {boolean} whether or not password is valid
 */
function comparePassword(enteredPass, savedPass) {
  return bcrypt.compareSync(enteredPass, savedPass);
}
