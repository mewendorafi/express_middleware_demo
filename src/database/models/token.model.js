const {
	Schema,
	model,
	Types: { ObjectId },
} = require('mongoose');

const tokenSchema = new Schema(
	{
		user: {
			type: ObjectId,
			ref: 'users',
			required: true,
		},
		token: { type: String, required: true },
		type: { type: String, required: true }, // Refresh token
		expiresAt: { type: Date, required: true },
	},
	{ timestamps: true }
);

module.exports = model('tokens', tokenSchema);
