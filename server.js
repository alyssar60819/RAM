const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
app.use(bodyParser.json());

const uri = 'mongodb://localhost:27017'; // Update with your MongoDB connection string
const client = new MongoClient(uri);

// API endpoint to add a new reading log entry
app.post('/reading-log', async (req, res) => {
  const entry = req.body;

  try {
    await client.connect();
    const database = client.db('readinglog');
    const collection = database.collection('entries');

    await collection.insertOne(entry);

    res.status(201).json({ message: 'Reading log entry added successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while adding the entry.' });
  } finally {
    await client.close();
  }
});

// API endpoint to retrieve all reading log entries
app.get('/reading-log', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('readinglog');
    const collection = database.collection('entries');

    const entries = await collection.find().toArray();

    res.status(200).json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while retrieving the entries.' });
  } finally {
    await client.close();
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
