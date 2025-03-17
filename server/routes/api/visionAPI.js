const express = require("express");
const router = express.Router();
const visionAPIController = require('../../controllers/visionAPIController');

router.post('/', visionAPIController.quickstart);

module.exports = router;