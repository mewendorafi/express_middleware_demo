const express = require('express');
const router = express.Router();

const authRouter = require('./auth.route');
const userRouter = require('./user.route');

const DEFAULT_ROUTES = [
	{
		path: '/auth',
		route: authRouter,
	},
	{
		path: '/user',
		route: userRouter,
	},
	// extend ...
];

DEFAULT_ROUTES.forEach(route => {
	router.use(route.path, route.route);
});

module.exports = router;
