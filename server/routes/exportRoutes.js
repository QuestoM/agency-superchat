const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');

router.post('/', exportController.exportChat);

module.exports = router;