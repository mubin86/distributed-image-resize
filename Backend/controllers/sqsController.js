require('dotenv').config();
const AppError = require('./../utils/appError');
const AWS = require("aws-sdk");
AWS.config.update({region: 'us-east-1'});
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

exports.sendImageWithResizeData = (req, res, next) => {
    let params = {
            // DelaySeconds: 10,
            MessageAttributes: {
            "imageUrl": {
                DataType: "String",
                StringValue: req.body.imageUrl
            },
            "width": {
                DataType: "Number",
                StringValue: "300"
            },
            "height": {
                DataType: "Number",
                StringValue: "300"
            }
            },
        MessageBody: 'Information of image with resize data',
        QueueUrl: process.env.AWS_SQS_URL
    };

    sqs.sendMessage(params, (err, data) => {
        if(err){
            console.log("sqs error is ", err);
            throw new AppError('Error occured during queue push', 400);
        }else{
            console.log("Succesfully sent to queue", data);
        }

        res.status(200).json({
            "message": "successfully sent to queue",
            "data": data
        })
        
    })
}