const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Mongo
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB database connection established successfully"))
  .catch(err => console.log(err));

// Routes
const releaseRouter = require('./routes/api/releases');
app.use('/api/releases', releaseRouter);

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
})
