const { MongoClient } = require('mongodb');

async function withDb(callable) {
  const client = await MongoClient.connect('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });
  const db = client.db('craigslist_database');

  await callable(db);

  client.close();
}

module.exports = withDb;
