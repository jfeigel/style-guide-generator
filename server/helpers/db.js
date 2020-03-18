const config = require('../config.json');
const logger = require('../logger');

const mongoose = require('mongoose');

const url = config.site.db.url;
const dbName = config.site.db.name;

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

let connection;

function MongoDBError(message) {
  this.name = 'MongoDBError';
  this.message = message || '';
}
MongoDBError.prototype = Error.prototype;

module.exports = {
  connect: connect,
  disconnect: disconnect,
  getDocument: getDocument,
  findOrCreate: findOrCreate,
  findDocumentsSimple: findDocumentsSimple,
  findDocumentsFull: findDocumentsFull,
  insertDocument: insertDocument,
  updateDocument: updateDocument,
  replaceDocument: replaceDocument,
  upsertDocument: upsertDocument,
  deleteDocument: deleteDocument
};

async function connect() {
  try {
    await mongoose.connect(`mongodb://${url}/${dbName}`, mongoOptions);
    connection = mongoose.connection;
    logger.info(`DB: Connect to [${dbName}] succeeded`);
    return true;
  } catch (err) {
    throw new MongoDBError(`DB: Connect to [${dbName}] failed`);
  }
}

async function disconnect() {
  try {
    return await connection.close();
  } catch (err) {
    throw new MongoDBError(`DB: Disconnect from [${dbName}] failed`);
  }
}

async function getDocument(id, collection) {
  try {
    return await connection.collection(collection).findOne({ _id: id });
  } catch (err) {
    throw new MongoDBError(`DB: Get of [${id}] failed`);
  }
}

async function findOrCreate(query, collection) {
  try {
    return await connection
      .collection(collection)
      .findOneAndUpdate(query, { $set: query }, { upsert: true });
  } catch (err) {
    throw new MongoDBError(`DB: Find or Create of [${query}] failed`);
  }
}

async function findDocumentsSimple(query, collection) {
  try {
    return await connection
      .collection(collection)
      .find(query)
      .toArray();
  } catch (err) {
    throw new MongoDBError(
      `DB: Find (Simple) of [${JSON.stringify(query)}] failed`
    );
  }
}

async function findDocumentsFull(
  query,
  projection,
  sort,
  skip,
  limit,
  collection
) {
  try {
    return await connection
      .collection(collection)
      .find(query, projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();
  } catch (err) {
    throw new MongoDBError(
      `DB: Find (Full) of [${JSON.stringify(query)}] failed`
    );
  }
}

async function insertDocument(document, collection) {
  try {
    return await connection.collection(collection).insertOne(document);
  } catch (err) {
    throw new MongoDBError(`DB: Insert of [${document._id}] failed`);
  }
}

async function updateDocument(query, document, collection) {
  try {
    const doc = await connection
      .collection(collection)
      .findOneAndUpdate(query, document, { returnOriginal: false });
    return doc.value;
  } catch (err) {
    throw new MongoDBError(`DB: Insert of [${document._id}] failed`);
  }
}

async function replaceDocument(query, document, collection) {
  try {
    const doc = await connection
      .collection(collection)
      .replaceOne(query, document);
    return doc.ops[0];
  } catch (err) {
    throw new MongoDBError(`DB: Replace of [${document._id}] failed`);
  }
}

async function upsertDocument(query, document, collection) {
  try {
    const doc = await connection
      .collection(collection)
      .replaceOne(query, document, { upsert: true });
    return doc.ops[0];
  } catch (err) {
    throw new MongoDBError(`DB: Upsert of [${document._id}] failed`);
  }
}

async function deleteDocument(query, collection) {
  try {
    await connection.collection(collection).deleteOne(query);
    return true;
  } catch (err) {
    throw new MongoDBError(`DB: Delete of [${JSON.stringify(query)}] failed`);
  }
}
