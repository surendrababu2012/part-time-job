var mongoose = require('mongoose');
var Schema = mongoose.Schema;

adminSchema = new Schema( {
	username: {type: String},
	password: {type: String},	
});

const admin = mongoose.model('admins', adminSchema);

module.exports = admin;