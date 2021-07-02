const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

// Connect to Mongo
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB database connection established successfully"))
  .catch(err => console.log(err));



// Routes
const routes = require('./routes');
app.use('/api', routes);

let server = app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
})
server.timeout = 500000;
