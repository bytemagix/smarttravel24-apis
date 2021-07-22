const express = require('express');
const driverEmailSignupController = require('../controllers/auth-controllers/driver-auth/driverEmailSignup');

const router = express.Router();

router.post('/driver-email-signup',driverEmailSignupController.driverEmailSignup);

module.exports = router;