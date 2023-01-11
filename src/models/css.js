const mongoose = require('mongoose');

const cssSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	cmd: {
		type: String,
		required: true
	},
	ip: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('css', cssSchema, 'css');
