const {Schema} = require('mongoose');
const {mongoose} = require('../models');

module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            name: String,
            email: String,
            phone: String,
            apikey: String,
            usagePlanId: String  // Changed this to an array of strings
        },
        { timestamps: true }
    );

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Client = mongoose.model("client", schema);
    return Client;
};
