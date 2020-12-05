import { MongoClient } from 'mongodb';

async function withDb(callable) {
  const client = await MongoClient.connect('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });
  const db = client.db('tracking_database');

  await callable(db);

  client.close();
}

module.exports = withDb;
