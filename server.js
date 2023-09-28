const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = 5678;

// Connect to MongoDB
const uri = process.env.MONGO_URL;
const dbName = process.env.DB_NAME;
const client = new MongoClient(uri);
let db;

client.connect()
  .then(() => {
    console.log('Connected to MongoDB');
    db = client.db(dbName); // Use the database name from .env
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });

// Middleware
app.use(cors());
app.use(express.json());

app.get('/users', async (req, res) => {
    const collectionName = process.env.DB_COLLECTION; // Use the collection name from .env
    const collection = db.collection(collectionName);
  
    try {
      const allUsers = await collection.find({}).toArray(); // Fetch all documents
      res.json(allUsers);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/check/:phoneNumber', async (req, res) => {
    const phoneNumber = req.params.phoneNumber;
    const collectionName = process.env.DB_COLLECTION; 
    const collection = db.collection(collectionName);

    try {
        const userDocument = await collection.findOne({ phone_number: phoneNumber });
        
        if (userDocument) {
            res.json({ exists: true });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
