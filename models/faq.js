var mongoose = require('mongoose');
var Schema = mongoose.Schema;

faqSchema = new Schema( {
	quest: {type: String},
	ans: {type: String,required:true,default:""},	
});

const faq = mongoose.model('faqs', faqSchema);

module.exports = faq;