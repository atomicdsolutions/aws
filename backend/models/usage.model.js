const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema({
  position: String,
  items: [
    {
      usagePlanId: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      items: {
        keyname: {
          type: [Array]
        }
      }
    }
  ],
});

const Usage = mongoose.model('ApiKey', usageSchema);

module.exports = Usage;