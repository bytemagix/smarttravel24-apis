const express = require('express');
const router = express.Router();

const BookingRequestController = require("../controllers/booking-controllers/booking-request");
const SendQuotationController = require("../controllers/booking-controllers/send-quotation");
const SendQuotationAdminController = require("../controllers/booking-controllers/send-quotation-admin");

router.post('/send-booking-request',BookingRequestController.sendBookingRequest);
router.post('/send-quotation', SendQuotationController.sendQuotation);
router.post('/send-quotation-admin', SendQuotationAdminController.sendQuotationAdmin);


module.exports = router;