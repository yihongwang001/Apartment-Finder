/* eslint-env node */
const { MongoClient } = require('mongodb');
const ObjectID = require('mongodb').ObjectID;

const connectDB = async () => {
  const myDB = {};
  const uri = 'mongodb://localhost:27017';

  /* PART1: methods for posts collection, update method is not included */

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

  // get one single post using post id
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

  // only used by admin
  myDB.deletePosts = async (deleteList) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('craigslist_database');
    console.log(deleteList);
    const postIDs = [];
    for (let i = 0; i < deleteList.length; i++) {
      postIDs.push(ObjectID(deleteList[i]));
    }
    await db.collection('posts').deleteMany({ _id: { $in: postIDs } });
    // when the admin deletes certain posts
    // the posts' viewed history should also be deleted
    return await db
      .collection('viewed')
      .deleteMany({ postId: { $in: deleteList } })
      .finally(() => client.close());
  };

  /* PART2: methods for savelists collection, CRUD included */

  myDB.getPostComment = async (userId, postId) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('craigslist_database');
    return db
      .collection('savelists')
      .find({ userId: userId, postId: postId })
      .toArray()
      .finally(() => client.close());
  };

  // get all the saved comments of one user
  myDB.getSaveList = async (userId) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('craigslist_database');
    let savedComments = await db
      .collection('savelists')
      .find({ userId: userId })
      .toArray();

    let postIdList = [];
    for (let i = 0; i < savedComments.length; i++) {
      postIdList.push(ObjectID(savedComments[i].postId));
    }
    return db
      .collection('posts')
      .find({ _id: { $in: postIdList } })
      .toArray()
      .finally(() => client.close());
  };

  // this method contains both create and update
  // the important line is let options = { upsert: true };
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

  /* PART3: methods for viewed collection, update is not included */

  // get viewedHistory in the past 3 days
  myDB.getViewedHistory = async () => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('craigslist_database');
    let timeRange = {
      timeStamp: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 3)),
        $lte: new Date(),
      },
    };
    // grouped by postId, calculate the count of viewed records
    // sort and return the first 5 results in decreasing order
    let data = await db
      .collection('viewed')
      .aggregate([
        { $match: timeRange },
        { $group: { _id: '$postId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .limit(5)
      .toArray()
      .finally(() => client.close());
    // change the array to a set
    let result = new Set();
    for (let i = 0; i < data.length; i++) {
      result.add(data[i]._id);
    }
    return result;
  };

  myDB.viewedWithinFiveMin = async (userId, postId) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('craigslist_database');
    let data = await db
      .collection('viewed')
      .find({
        userId: userId,
        postId: postId,
        timeStamp: {
          $gte: new Date(new Date().setMinutes(new Date().getMinutes() - 5)),
          $lte: new Date(),
        },
      })
      .toArray()
      .finally(() => client.close());

    return data.length > 0;
  };

  myDB.addViewedHistory = async (postId, userId, timeStamp) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('craigslist_database');
    // before add the record, first check if this userId has visited this postId within 5 minutes
    // if yes, don't add this record
    let recentlyViewed = await myDB.viewedWithinFiveMin(userId);
    if (!recentlyViewed) {
      let newRecord = {
        postId: postId,
        userId: userId,
        timeStamp: timeStamp,
      };
      return await db
        .collection('viewed')
        .insertOne(newRecord)
        .finally(() => client.close());
    }
  };

  return myDB;
};

module.exports = connectDB;
