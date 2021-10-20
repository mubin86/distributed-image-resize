require('dotenv').config();
const {isMainThread, parentPort, workerData} = require('worker_threads');
const AWS = require("aws-sdk");
AWS.config.update({region: 'us-east-1'});
const { Consumer } = require('sqs-consumer');
const https = require('https');
const http = require("http");
const crypto = require('crypto');
// const sharp = require('sharp');
const { measureMemory } = require('vm');
const Jimp = require('jimp');

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey
});

if(!isMainThread){
    const imageResize = (message) => {
        console.log("message is ", message);
        const extension = message.imageUrl.split('.').pop();
        const fileName = `${crypto.randomBytes(14).toString('hex')}.${extension}`;
        let signedUrl;

        const getObject = () => {
            var getParams = {
                Bucket: process.env.AWS_BUCKET_NAME, 
                Key: message.key,
                Expires: 60*5
            }
            
            s3.getSignedUrl('getObject', getParams, function(err, url) {
                // Handle any error and exit
                if (err){
                    console.log("get object error is ", err);
                    return err;
                }
                signedUrl = url;

            Jimp.read(signedUrl)
                .then(image => {
                    // have to do necessary stuff with the image.
                    return image
                    .resize(+message.width, +message.height)
                    .quality(60) 
                    .write(fileName);
                })
                .catch(err => {
                    // Handle an exception.
                    console.log("resize error is ", err);
                });
            });
        }
            getObject();
        
    }

    const consumer = Consumer.create({
        queueUrl: process.env.AWS_SQS_URL,
        handleMessage:  (message) => {
            console.log("message from consumer is ", message);
            let sqsMessage = JSON.parse(message.Body);
            imageResize(sqsMessage);
        },
        sqs: new AWS.SQS({
            httpOptions: {
            agent: new https.Agent({
                keepAlive: true //avoid connect time on each request
            })
            }
        })
    });

    consumer.on('error', (err) => {
    console.error(err.message);
    });

    consumer.on('processing_error', (err) => {
    console.error(err.message);
    });

    consumer.start();
}