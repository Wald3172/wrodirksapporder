const express = require('express');
const router = express.Router();
const apiRouter = require('./api');
const apiOrder = require('./order');

router.use(apiRouter);
router.use(apiOrder);

module.exports = router;