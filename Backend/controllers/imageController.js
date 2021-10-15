require('dotenv').config();
const S3 = require("aws-sdk/clients/s3");
const AppError = require('./../utils/appError');

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
});


exports.uploadImage = (req, res, next) => {





};