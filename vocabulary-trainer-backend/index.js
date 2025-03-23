const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const vocabularyRoutes = require('./routes/vocabularyRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Initialized MongoDB On The Backend'))
  .catch(err => console.error(err));

// Vocabulary Routes
app.use('/api/vocabulary', vocabularyRoutes);

// Start server
app.listen(5000, () => {
  console.log('Initilized Server In Port 5000');
});
