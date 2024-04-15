const express = require('express');
const router = express.Router();
const apiRouter = require('./api');
const apiOrder = require('./order');
const apiAuth = require('./auth');

router.use(apiRouter);
router.use(apiOrder);
router.use(apiAuth);

module.exports = router;