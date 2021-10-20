require('dotenv').config();
const AppError = require('./../utils/appError');
const crypto = require('crypto');
const aws = require("aws-sdk");
const multer = require('multer');
const multerS3 = require('multer-s3');
let request = require('request');

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
    accessKeyId,
    secretAccessKey,
    region
});

//             let params = {
//                     Bucket: bucketName, 
//                     Key: '', 
//                     Tagging: "public=yes",
//                     Body: '',
//                     // ContentType: file.mimetype
//                 };
//              s3.putObject(params, function(err, data) {
//                     if (err) {
//                     console.log(err, err.stack); // an error occurred
//                     } else {
//                     console.log("data is ", data);           // successful response
//                     }
//                 });


exports.upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_BUCKET_NAME,
        metadata: function (req, file, cb) {
            cb(null, {
                originalname: file.originalname
            });
        },
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            const extension = file.originalname.split('.').pop();
            const fileName = `${crypto.randomBytes(24).toString('hex')}.${extension}`;
            cb(null, fileName);
        }
    })
})

exports.imageUploadResponse = (req, res, next) => {
    console.log("req.file is ", req.files);
    let location = [];
    let key = [];

    req.files.map(file => (key.push(file.key) && location.push(file.location)));

        res.status(200).json({
            status: 'success',
            message: 'Files Uploaded',
            data: {
                key,
                location
            }
        })
    
};