const express = require('express');
const router = express.Router();
const imageController = require('./../controllers/imageController');

router
.route('/image-upload')
.post(imageController.uploadImage);

module.exports = router;