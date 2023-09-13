const { Schema } = require('mongoose');
const { mongoose } = require('../models');

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      position: String,
      items: [
        {
          id: String,
          name: String,
          description: String,
          enabled: Boolean,
          createdDate: Date,
          lastUpdatedDate: Date,
          stageKeys: [String]

        }
      ]
    },
    { timestamps: true }
  );
  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const ApiKeys = mongoose.model("apikeys", schema);
  return ApiKeys;
};