const { genRefreshToken, genAccessToken } = require('../services/token.service');

const NODE_ENV = process.env.NODE_ENV;

module.exports = async function serveTokens(uid, res) {
	const { refreshToken, maxAgeRefresh } = await genRefreshToken(uid);
	const { accessToken, maxAgeAccess } = genAccessToken(uid);

	res.cookie('refresh-token', refreshToken, {
		httpOnly: true,
		path: '/',
		maxAge: maxAgeRefresh,
		secure: NODE_ENV === 'production', // Sets "Secure" attribute if in production
		sameSite: NODE_ENV === 'production' ? 'None' : 'Lax', // Sets "SameSite" attribute
	});

	res.cookie('access-token', accessToken, {
		httpOnly: true,
		path: '/',
		maxAge: maxAgeAccess,
		secure: NODE_ENV === 'production',
		sameSite: NODE_ENV === 'production' ? 'None' : 'Lax',
	});

	//! Alternative method to set response cookies
	// res.append(
	// 	'Set-Cookie',
	// 	`refresh-token=${refreshToken}; HttpOnly; Path=/; Max-Age=${maxAgeRefresh}; ${
	// 		process.env.NODE_ENV === 'production' ? 'Secure; SameSite=None' : 'SameSite=Lax'
	// 	}`
	// );

	// res.append(
	// 	'Set-Cookie',
	// 	`access-token=${accessToken}; HttpOnly; Path=/; Max-Age=${maxAgeAccess}; ${
	// 		process.env.NODE_ENV === 'production' ? 'Secure; SameSite=None' : 'SameSite=Lax'
	// 	}`
	// );

	return { accessToken, refreshToken };
};
