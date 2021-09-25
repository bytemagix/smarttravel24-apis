const express = require('express');
const router = express.Router();

const addCarTypeController = require("../controllers/admin-controllers/add-car-type");
const addCarNameController = require("../controllers/admin-controllers/add-car-name");
const deleteCarTypeController = require("../controllers/admin-controllers/delete-car-type");
const deleteCarNameController = require("../controllers/admin-controllers/delete-car-name");
const approveDriverController = require("../controllers/admin-controllers/approve-driver");

router.post('/add-car-type', addCarTypeController.addCarType);
router.post('/add-car-name', addCarNameController.addCarName);
router.post('/delete-car-type',deleteCarTypeController.deleteCarType);
router.post('/delete-car-name', deleteCarNameController.deleteCarName);
router.post('/approve-driver',approveDriverController.approveDriver);

module.exports = router;