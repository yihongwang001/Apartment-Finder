const { MongoClient } = require('mongodb');
const ObjectID = require('mongodb').ObjectID;

const connectDB = async () => {
  const myDB = {};
  const uri = 'mongodb://localhost:27017';

  /* PART1: methods for posts collection, CRUD included */

  // used by anonymous visitors and logged-in users
  myDB.getPosts = async (query) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('craigslist_database');
    return db
      .collection('posts')
      .find(query)
      .sort({ _id: -1 })
      .toArray()
      .finally(() => client.close());
  };

  // get one single post using its id in the database
  myDB.getSinglePost = async (postID) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('craigslist_database');
    return db
      .collection('posts')
      .find({ _id: ObjectID(postID) })
      .toArray()
      .finally(() => client.close());
  };

  // only used by admin, batch import function
  myDB.addPosts = async (newPosts) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('craigslist_database');
    return await db
      .collection('posts')
      .insertMany(newPosts)
      .finally(() => client.close());
  };

  // used by anonymous visitors and logged-in users
  // update the viewed history of each post
  myDB.updatePost = async (documentID, record) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('craigslist_database');
    const filter = { _id: ObjectID(documentID) };
    const updateDoc = { $set: { viewed: record } };
    return db
      .collection('posts')
      .updateOne(filter, updateDoc)
      .finally(() => client.close());
  };

  // only used by admin
  myDB.deletePosts = async (deleteList) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('craigslist_database');
    const documentIDs = [];
    for (let i = 0; i < deleteList.length; i++) {
      documentIDs.push(ObjectID(deleteList[i]));
    }
    return await db
      .collection('posts')
      .deleteMany({ _id: { $in: documentIDs } })
      .finally(() => client.close());
  };

  /* PART2: methods for savelists collection, CRUD included */

  // myDB.getSaveList = async (userId, postId) => {
  //   const client = new MongoClient(uri, { useUnifiedTopology: true });
  //   await client.connect();
  //   const db = client.db('craigslist_database');
  //   let query = { userId: userId, postId: postId };
  //   return db
  //     .collection('savelists')
  //     .find(query)
  //     .toArray()
  //     .finally(() => client.close());
  // };

  myDB.getSaveList = async (query) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('craigslist_database');
    return db
      .collection('savelists')
      .find(query)
      .toArray()
      .finally(() => client.close());
  };

  // this method contains both create and update
  // the line is let options = { upsert: true };
  myDB.updateOneComment = async (userId, postId, comment) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('craigslist_database');
    let query = { userId: userId, postId: postId };
    let newvalues = {
      $set: {
        userId: userId,
        postId: postId,
        comment: comment,
      },
    };
    let options = { upsert: true };
    return db
      .collection('savelists')
      .updateOne(query, newvalues, options)
      .finally(() => client.close());
  };

  myDB.deleteOneComment = async (userId, postId) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('craigslist_database');
    let query = { userId: userId, postId: postId };
    return await db
      .collection('savelists')
      .deleteOne(query)
      .finally(() => client.close());
  };

  return myDB;
};

module.exports = connectDB;
