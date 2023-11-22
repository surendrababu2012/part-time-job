var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema( {
	
	unique_id: Number,
	email: String,
	username: String,
	password: String,
	passwordConf: String
}),

claimSchema = new Schema(
	{
		InsuranceID:String,
		InsuranceType:String,
		CoverageDetails:String,
		Benefits:String,
		Services:String
	}
),

User = mongoose.model('User', userSchema);
ClaimDetails=mongoose.model('ClaimDetails',claimSchema)
module.exports = {User,ClaimDetails};

