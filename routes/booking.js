const express = require('express');
const router = express.Router();

const BookingRequestController = require("../controllers/booking-controllers/booking-request");
const SendBookingController = require("../controllers/booking-controllers/send-quotation");

router.post('/send-booking-request',BookingRequestController.sendBookingRequest);
router.post('/send-quotation', SendBookingController.sendQuotation);


module.exports = router;