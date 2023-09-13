const express = require('express');
const aws = require('./router/apigatewayRouter');
const cors = require('cors');
const app = express();
const port = 3000;
const {
    ObjectId
} = require('mongodb');

// Simplified CORS options
const corsOptions = {
    origin: 'http://localhost:4200',
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    credentials: true
};
// for parsing application/json
app.use(express.json()); 
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); 
// Use CORS middleware before any routes
app.use(cors(corsOptions));

// Then add your routes
app.use('/api', aws);

const db = require("./models");
const usageplan = require("./models/usageplan.model");
const apikey = require("./models/apikey.model");

db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the Database!", err);
        process.exit();
    });

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});