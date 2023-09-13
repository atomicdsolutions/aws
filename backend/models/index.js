const dbConfig = require("../config/db.js");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.url = dbConfig.url;
db.usageplan = require("./usageplan.model.js")(mongoose);
db.apikey = require("./apikey.model.js")(mongoose);
db.client = require("./client.model.js")(mongoose);
module.exports = db;