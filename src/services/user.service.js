const User = require('../database/models/user.model');

async function queryById(uid) {
	return await User.findById(uid);
}

async function deleteById(uid) {
	const user = await queryById(uid);
	if (!user) throw new Error('User not found');
	return await user.deleteOne();
}

module.exports = { deleteById };
