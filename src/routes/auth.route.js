const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth.controller');

router.post('/register', (req, res) => auth.register(req, res));

module.exports = router;
