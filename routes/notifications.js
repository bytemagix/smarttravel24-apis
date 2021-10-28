const express = require('express');
const router = express.Router();

const savePushTokenController = require("../controllers/notifications-controllers/save-push-token");
const saveAdminPushTokenController = require("../controllers/notifications-controllers/save-admin-push-token");

router.post('/save-push-token', savePushTokenController.savePushToken);
router.post('/save-admin-push-token', saveAdminPushTokenController.saveAdminPushToken);

module.exports = router;