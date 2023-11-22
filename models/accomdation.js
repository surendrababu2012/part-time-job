const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
    locationID: {type: String},
    Image: {type: String},
    Price: {type: Number},
    Contact: {type: String},
    Email: {type: String},
    location: {type: String},
});

const Accommodation = mongoose.model('Accommodation', houseSchema);

module.exports = Accommodation;
