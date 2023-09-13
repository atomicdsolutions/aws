const mongoose = require('mongoose');

const usagePlanSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  apiStages: [
    {
      apiId: String,
      stage: String,
    },
  ],
  throttle: {
    burstLimit: Number,
    rateLimit: Number,
  },
  quota: {
    limit: Number,
    offset: Number,
    period: String,
  },
  tags: Object,
});

const UsagePlan = mongoose.model('UsagePlan', usagePlanSchema);

module.exports = UsagePlan;