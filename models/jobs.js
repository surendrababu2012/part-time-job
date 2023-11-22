const mongoose = require('mongoose');

const jobsSchema = new mongoose.Schema({
    JobID: {type: String},
    locationId: {type: String},
    location: {type: String},
    Category: {type: String},
    Title: {type: String},
    CompanyName: {type: String},
    Description: {type: String},
    Pay: {type: Number},
    Requirements: {type: String},
});

const Jobs = mongoose.model('Jobs', jobsSchema);

module.exports = Jobs;
