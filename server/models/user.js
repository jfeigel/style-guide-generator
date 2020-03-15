const bcrypt = require('bcryptjs');
const db = require('../helpers/db');

module.exports = {
  get: get,
  authenticate: authenticate,
  generate: generate,
  create: create,
  save: save,
  clean: clean
}

async function get(id) {
  const user = await db.getDocument(id, 'users');
  return clean(user);
}

async function authenticate(id, password) {
  const user = await get(id);
  if (!user) return { message: 'Incorrect username' };
  if (!comparePassword(password, user.password)) return { message: 'Incorrect password' };
  return {
    message: 'Success',
    user: clean(user)
  };
}

function generate(id) {
  return {
    _id: id,
    username: '',
    password: '',
    createdAt: new Date()
  };
}

async function create(data) {
  data.password = encryptPassword(data.password);
  const userBase = generate(data.id);
  const userFull = Object.assign(userBase, data);
  const user = await db.insertDocument(userFull, 'users');
  return clean(user);
}

async function save(user) {
  const confirmation = await db.upsertDocument({_id: user._id}, user, 'users');
  return clean(confirmation);
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
