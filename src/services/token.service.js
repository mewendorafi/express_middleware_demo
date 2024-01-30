const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const Token = require('../database/models/token.model');

const currentDate = dayjs().toDate();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_ACCESS_EXP = process.env.JWT_ACCESS_EXPIRATION_HOURS;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_REFRESH_EXP = process.env.JWT_REFRESH_EXPIRATION_DAYS;

const jwtAccessInteger = parseInt(JWT_ACCESS_EXP);
const jwtRefreshInteger = parseInt(JWT_REFRESH_EXP);

const accessExpiryTimestamp = jwtAccessInteger * 60 * 60 * 1000; // hours
const refreshExpiryTimestamp = jwtRefreshInteger * 24 * 60 * 60 * 1000; // days

const refreshExpiryDate = dayjs().add(jwtRefreshInteger, 'days').toDate();

const genRefreshToken = async uid => {
	try {
		const webToken = await Token.findOne({
			user: new ObjectId(uid),
			type: 'refresh',
			expiresAt: { $gt: currentDate },
		}).select('token expiresAt');

		if (webToken)
			return {
				refreshToken: webToken.token,
				maxAgeRefresh: refreshExpiryTimestamp,
			};

		const newWebToken = jwt.sign({ user: uid }, JWT_REFRESH_SECRET, {
			expiresIn: refreshExpiryTimestamp,
		});

		await Token.deleteOne({
			user: new ObjectId(uid),
			type: 'refresh',
		});

		await Token.create({
			user: new ObjectId(uid),
			token: newWebToken,
			type: 'refresh',
			expiresAt: refreshExpiryDate,
		});

		return {
			refreshToken: newWebToken,
			maxAgeRefresh: refreshExpiryTimestamp,
		};
	} catch (error) {
		console.error(error);
		throw new Error(error.message);
	}
};

const genAccessToken = uid => {
	try {
		const webToken = jwt.sign({ user: uid }, JWT_ACCESS_SECRET, {
			expiresIn: accessExpiryTimestamp,
		});
		return { accessToken: webToken, maxAgeAccess: accessExpiryTimestamp };
	} catch (error) {
		console.error(error);
		throw new Error(error.message);
	}
};

const decodeRefreshToken = async refreshToken => {
	try {
		const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
		const { _id: uid } = decoded.user;

		const webToken = await Token.findOne({
			user: new ObjectId(uid),
			token: refreshToken,
			expiresAt: { $gt: currentDate },
		});

		if (!webToken) {
			await Token.deleteOne({
				user: new ObjectId(uid),
				token: refreshToken,
			});

			return { isRefreshTokenValid: false };
		}

		const newAccessToken = genAccessToken(uid);

		return { uid, newAccessToken, isRefreshTokenValid: true };
	} catch (error) {
		console.error(error);
		return { isRefreshTokenValid: false };
	}
};

const decodeAccessToken = async accessToken => {
	try {
		const decoded = jwt.verify(accessToken, JWT_ACCESS_SECRET);
		const { _id: uid } = decoded.user;
		return { uid, isAccessTokenValid: true };
	} catch (error) {
		console.error(error);
		return { isAccessTokenValid: false };
	}
};

module.exports = { genRefreshToken, genAccessToken, decodeRefreshToken, decodeAccessToken };
