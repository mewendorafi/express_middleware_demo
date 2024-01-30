const User = require('../database/models/user.model');
const serveWebTokens = require('../modules/serveWebTokens');

const register = async (req, res) => {
	const user = await User.create(req.body);
	const uid = user._id;
	const { accessToken, refreshToken } = await serveWebTokens(uid, res);
	return res.status(201).send({ user, tokens: { accessToken, refreshToken } });
};

module.exports = { register };
