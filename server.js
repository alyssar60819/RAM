const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
app.use(bodyParser.json());

const uri = 'mongodb://localhost:27017'; // Update with your MongoDB connection string
const client = new MongoClient(uri);
let database; // Declare the database variable outside the route handlers

async function connectToDatabase() {
  try {
    await client.connect();
    database = client.db('readinglog');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process if unable to connect to the database
  }
}

connectToDatabase(); // Connect to the database when the server starts

// API endpoint to add a new reading log entry
app.post('/reading-log', async (req, res) => {
  const entry = req.body;

  try {
    const collection = database.collection('entries');
    await collection.insertOne(entry);

    res.status(201).json({ message: 'Reading log entry added successfully.' });
  } catch (error) {
    console.error('Error adding the entry:', error);
    res.status(500).json({ message: 'An error occurred while adding the entry.' });
  }
});

// API endpoint to retrieve all reading log entries
app.get('/reading-log', async (req, res) => {
  try {
    const collection = database.collection('entries');
    const entries = await collection.find().toArray();

    res.status(200).json(entries);
  } catch (error) {
    console.error('Error retrieving the entries:', error);
    res.status(500).json({ message: 'An error occurred while retrieving the entries.' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
