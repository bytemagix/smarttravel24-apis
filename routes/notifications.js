const express = require('express');
const router = express.Router();

const savePushTokenController = require("../controllers/notifications-controllers/save-driver-push-token");
const saveAdminPushTokenController = require("../controllers/notifications-controllers/save-admin-push-token");

router.post('/save-driver-push-token', savePushTokenController.saveDriverPushToken);
router.post('/save-admin-push-token', saveAdminPushTokenController.saveAdminPushToken);

module.exports = router;