const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

app.use(cors()); 
app.use(express.json()); 

app.use('/api/gemini', require('./routes/geminiRouter'));
app.use('/api/posts', require('./routes/postRouter'));

const startServer = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error('FATAL ERROR: MONGODB_URI is not defined in .env file.');
    }

    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connection successful.');

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();