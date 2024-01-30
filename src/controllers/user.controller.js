const userService = require('../services/user.service');

const remove = async (req, res) => {
	const result = await userService.deleteById(req.params.uid);
	return res.status(200).send(result);
};

module.exports = { remove };
