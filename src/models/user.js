const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	id: {
		type: String,
		required: true
	},
	aniProfile: {
		type: mongoose.Schema.Types.Mixed,
		required: true
	}
});

module.exports = mongoose.model('user', userSchema, 'user');
