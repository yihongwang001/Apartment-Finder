const { MongoClient } = require('mongodb');
const dbWrapper = require('./utils');

const connectDB = async () => {
  const myDB = {};
  const uri = 'mongodb://localhost:27017';

  // used by anonymous visitors and logged in users
  myDB.getPosts = async () => {
    let result;
    await dbWrapper(async (db) => {
      const col = db.collection('posts');
      const query = {};
      result = col.find(query).sort({ _id: -1 }).toArray();
    });
    return result;
  };

  // only used by admin
  myDB.addPost = async (newPost) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('craigslist_database');
    const col = db.collection('posts');
    return await col.insertOne(newPost).finally(() => client.close());
  };

  // used by anonymous visitors and logged in users
  // update the viewed history of each post with record
  myDB.updatePost = async (documentID, record) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('craigslist_database');
    const col = db.collection('posts');

    const filter = { _id: ObjectID(documentID) };
    const updateDoc = { $set: { viewed: record } };
    return col.updateOne(filter, updateDoc).finally(() => client.close());
  };

  // only used by admin
  myDB.deletePost = async (documentID) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('craigslist_database');
    const col = db.collection('posts');

    const query = { _id: ObjectID(documentID) };
    return await col.deleteOne(query).finally(() => client.close());
  };

  return myDB;
};

module.exports = connectDB();
