const express = require('express');
const router = express.Router();
const checkEligibilityController = require('../../controllers/checkEligibilityController');

router.post('/', checkEligibilityController.checkEligibility);

module.exports = router;