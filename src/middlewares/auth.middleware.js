const { decodeRefreshToken, decodeAccessToken } = require('../services/token.service');

const authoriseUser = async (req, res, next) => {
	try {
		const refreshToken = req.cookies['refresh-token'];
		const accessToken = req.cookies['access-token'];

		if (!refreshToken) return res.sendStatus(401);

		if (accessToken) {
			const accessResult = await decodeAccessToken(accessToken);
			const { isAccessTokenValid } = accessResult;
			if (isAccessTokenValid) {
				const { uid } = accessResult;
				req.uid = uid;
				return next();
			}
		}

		const refreshResult = await decodeRefreshToken(refreshToken);
		const { isRefreshTokenValid } = refreshResult;
		if (!isRefreshTokenValid) return res.sendStatus(401);

		return next();
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
};

module.exports = authoriseUser;
