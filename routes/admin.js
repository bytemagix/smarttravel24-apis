const express = require('express');
const router = express.Router();

const addCarTypeController = require("../controllers/admin-controllers/add-car-type");
const addCarNameController = require("../controllers/admin-controllers/add-car-name");

router.post('/add-car-type', addCarTypeController.addCarType);
router.post('/add-car-name', addCarNameController.addCarName);

module.exports = router;