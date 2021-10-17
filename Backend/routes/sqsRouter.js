const express = require('express');
const router = express.Router();
const {sendImageWithResizeData} = require('../controllers/sqsController');

router
.route('/create-sqs-request')
.post(sendImageWithResizeData)


module.exports = router;