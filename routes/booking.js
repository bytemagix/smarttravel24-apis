const express = require('express');
const router = express.Router();

const BookingRequestController = require("../controllers/booking-controllers/booking-request");
const SendQuotationController = require("../controllers/booking-controllers/send-quotation");
const SendQuotationAdminController = require("../controllers/booking-controllers/send-quotation-admin");
const GetNewBookingsController = require("../controllers/booking-controllers/get-new-bookings");
const GetActiveBookingsController = require("../controllers/booking-controllers/get-active-bookings");
const GetConfirmedBookingsController = require("../controllers/booking-controllers/get-confirmed-bookings");

router.post('/send-booking-request',BookingRequestController.sendBookingRequest);
router.post('/send-quotation', SendQuotationController.sendQuotation);
router.post('/send-quotation-admin', SendQuotationAdminController.sendQuotationAdmin);
router.post('/get-new-bookings',GetNewBookingsController.getNewBookings);
router.post('/get-active-bookings',GetActiveBookingsController.getActiveBookings);
router.post('/get-confirmed-bookings',GetConfirmedBookingsController.getConfirmedBookings);


module.exports = router;