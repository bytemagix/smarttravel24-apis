const express = require('express');
const router = express.Router();

const BookingRequestController = require("../controllers/booking-controllers/booking-request");

router.post('/send-booking-request',BookingRequestController.sendBookingRequest);


module.exports = router;