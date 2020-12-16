/* eslint-env node */
const { MongoClient } = require("mongodb");

async function withDb(callable) {
  const uri = process.env.MONGO_URL || "mongodb://localhost:27017";
  const client = await MongoClient.connect(uri, {
    useUnifiedTopology: true,
  });
  const db = client.db("craigslist_database");

  await callable(db);

  client.close();
}

module.exports = withDb;
