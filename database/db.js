const { MongoClient } = require('mongodb');

const connectDB = async () => {
  const myDB = {};
  const uri = 'mongodb://localhost:27017';

  // used by anonymous visitors and logged-in users
  myDB.getPosts = async () => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('craigslist_database');
    const col = db.collection('posts');

    const query = {};
    return col
      .find(query)
      .sort({ _id: -1 })
      .toArray()
      .finally(() => client.close());
  };

  // only used by admin, batch import function
  myDB.addPosts = async (newPosts) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('craigslist_database');
    const col = db.collection('posts');
    return await col.insertMany(newPosts).finally(() => client.close());
  };

  // used by anonymous visitors and logged-in users
  // update the viewed history of each post
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

module.exports = connectDB;
