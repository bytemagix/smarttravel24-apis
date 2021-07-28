const express = require('express');

const registerDriverController = require('../controllers/driver-controllers/register-driver');
const getNewRegistrationController = require('../controllers/driver-controllers/get-new-registration');
const approveDriverController = require('../controllers/driver-controllers/approve-driver');
const getDriverInfoController = require('../controllers/driver-controllers/get-driver-info');
const getApprovedDriverController = require('../controllers/driver-controllers/get-approved-drivers');
const documentUploadController = require('../controllers/driver-controllers/upload-document');

const router = express.Router();

router.post('/register-driver',registerDriverController.postRegisterDriver);
router.get('/get-new-registration',getNewRegistrationController.getNewRegistration);
router.post('/approve-driver',approveDriverController.postApproveDriver);
router.post('/get-driver-info',getDriverInfoController.getDriverInfo);
router.get('/get-approved-drivers',getApprovedDriverController.getApprovedDrivers);
router.post('/upload-document',documentUploadController.uploadDocument);

module.exports = router;