const express = require('express');
const router = express.Router();
const { upload, imageUploadResponse } = require('./../controllers/imageController');

router
.route('/image-upload')
.post(upload.array('images'), imageUploadResponse);

router
.route('/create-request')
.post()
module.exports = router;