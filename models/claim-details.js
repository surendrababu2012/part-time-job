const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
    InsuranceID: {type: String},
    InsuranceType: {type: String},
    CoverageDetails: {type: String},
    Benefits: {type: String},
    Services: {type: String}
}, {
    collection: "ClaimDetail"
});

const ClaimDetail = mongoose.model('ClaimDetail', claimSchema);

module.exports = ClaimDetail;
