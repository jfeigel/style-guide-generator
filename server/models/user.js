const bcrypt = require('bcryptjs');
const { model, Schema } = require('mongoose');
const merge = require('deepmerge');
const _ = require('lodash');

const base = {
  providers: {
    google: null,
    github: null
  },
  email: null,
  password: null,
  firstName: null,
  lastName: null,
  displayName: null
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
  displayName: String
});
const UserModel = model('User', UserSchema);

module.exports = {
  create: create,
  getById: getById,
  getByEmail: getByEmail,
  getByProviderId: getByProviderId,
  authenticate: authenticate,
  clean: clean
};
async function create(user) {
  if (user.password) {
    user.password = encryptPassword(user.password);
  }

  const condition = {};
  condition.email = user.email;

  // Remove extra props from mongoose document
  const existingUser = (await UserModel.findOne(condition).exec()).toObject();

  // Only take the base props
  const newUser = merge(_.pick(existingUser || base, _.keys(base)), user);

  // Add back MongoDB props if updating an existing user
  if (existingUser && existingUser._id) {
    newUser._id = existingUser._id;
    newUser.__v = existingUser.__v;
  }

  return await UserModel.replaceOne(condition, newUser, {
    upsert: true
  }).exec();
}
async function getById(id) {
  return await UserModel.findById(id).exec();
}

async function getByEmail(username) {
  return await UserModel.findOne({ username }).exec();
}

async function getByProviderId(provider, id) {
  const condition = {};
  condition[`providers.${provider}`] = id;
  return await UserModel.findOne(condition).exec();
}

async function authenticate(id, password) {
  const user = await get(id);
  if (!user) return { message: 'Incorrect username' };
  if (!comparePassword(password, user.password))
    return { message: 'Incorrect password' };
  return {
    message: 'Success',
    user: clean(user)
  };
}

function clean(user) {
  delete user.password;
  return user;
}

function encryptPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(12));
}

function comparePassword(enteredPass, savedPass) {
  return bcrypt.compareSync(enteredPass, savedPass);
}
