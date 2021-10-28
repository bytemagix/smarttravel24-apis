const express = require('express');
const router = express.Router();

const customerEnquiryController = require("../controllers/message-controllers/customer-enquiry");

router.post('/send-customer-enquiry', customerEnquiryController.sendCustomerEnquiry);

module.exports = router;