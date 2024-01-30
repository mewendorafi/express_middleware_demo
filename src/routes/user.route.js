const express = require('express');
const router = express.Router();
const user = require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware');

router.route('/:uid').delete(auth, (req, res) => user.remove(req, res));

module.exports = router;
