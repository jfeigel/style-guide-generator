const config = require('../config.json');

const MongoClient = require('mongodb').MongoClient;

const url = config.site.db.url;
const dbName = config.site.db.name;

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

function MongoDBError(message) {
  this.name = 'MongoDBError';
  this.message = message || '';
}
MongoDBError.prototype = Error.prototype;

module.exports = {
  getDocument: getDocument,
  findDocumentsSimple: findDocumentsSimple,
  findDocumentsFull: findDocumentsFull,
  insertDocument: insertDocument,
  updateDocument: updateDocument,
  replaceDocument: replaceDocument,
  upsertDocument: upsertDocument,
  deleteDocument: deleteDocument
};

async function getDocument(id, collection) {
  try {
    const client = await MongoClient.connect(url, mongoOptions);
    const db = client.db(dbName);
    const doc = await db.collection(collection).findOne({ _id: id });
    client.close();
    return doc;
  } catch (err) {
    throw new MongoDBError(`DB: Get of [${id}] failed`);
  }
}

async function findDocumentsSimple(query, collection) {
  try {
    const client = await MongoClient.connect(url, mongoOptions);
    const db = client.db(dbName);
    const doc = await db
      .collection(collection)
      .find(query)
      .toArray();
    client.close();
    return doc;
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
    const client = await MongoClient.connect(url, mongoOptions);
    const db = client.db(dbName);
    const doc = await db
      .collection(collection)
      .find(query, projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();
    client.close();
    return doc;
  } catch (err) {
    throw new MongoDBError(
      `DB: Find (Full) of [${JSON.stringify(query)}] failed`
    );
  }
}

async function insertDocument(document, collection) {
  try {
    const client = await MongoClient.connect(url, mongoOptions);
    const db = client.db(dbName);
    const doc = await db.collection(collection).insertOne(document);
    client.close();
    return doc;
  } catch (err) {
    throw new MongoDBError(`DB: Insert of [${document._id}] failed`);
  }
}

async function updateDocument(query, document, collection) {
  try {
    const client = await MongoClient.connect(url, mongoOptions);
    const db = client.db(dbName);
    const doc = await db
      .collection(collection)
      .findOneAndUpdate(query, document, { returnOriginal: false });
    client.close();
    return doc.value;
  } catch (err) {
    throw new MongoDBError(`DB: Insert of [${document._id}] failed`);
  }
}

async function replaceDocument(query, document, collection) {
  try {
    const client = await MongoClient.connect(url, mongoOptions);
    const db = client.db(dbName);
    const doc = await db.collection(collection).replaceOne(query, document);
    client.close();
    return doc.ops[0];
  } catch (err) {
    throw new MongoDBError(`DB: Replace of [${document._id}] failed`);
  }
}

async function upsertDocument(query, document, collection) {
  try {
    const client = await MongoClient.connect(url, mongoOptions);
    const db = client.db(dbName);
    const doc = await db
      .collection(collection)
      .replaceOne(query, document, { upsert: true });
    client.close();
    return doc.ops[0];
  } catch (err) {
    throw new MongoDBError(`DB: Upsert of [${document._id}] failed`);
  }
}

async function deleteDocument(query, collection) {
  try {
    const client = await MongoClient.connect(url, mongoOptions);
    const db = client.db(dbName);
    await db.collection(collection).deleteOne(query);
    client.close();
    return true;
  } catch (err) {
    throw new MongoDBError(`DB: Delete of [${JSON.stringify(query)}] failed`);
  }
}
