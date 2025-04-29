require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const noticesRouter = require('./routes/notices');

const app = express();
app.use(express.json());

// Serve the static HTML frontend
app.use(express.static(path.join(__dirname, 'public')));

// Use notices router for API routes
app.use('/api/notices', noticesRouter);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch(err => console.error(err));
