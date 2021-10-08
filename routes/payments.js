const express = require('express');
const router = express.Router();

const createMojoRequestController = require("../controllers/payment-contollers/create-mojo-request");
const mojoWebHookController = require("../controllers/payment-contollers/mojo-web-hook");

router.post('/create-mojo-request', createMojoRequestController.createMojoRequest);
router.post('/mojo-web-hook', mojoWebHookController.mojoWebHook);

module.exports = router;