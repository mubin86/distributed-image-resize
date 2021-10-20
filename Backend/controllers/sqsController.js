require('dotenv').config();
const AppError = require('./../utils/appError');
const AWS = require("aws-sdk");
const { Consumer } = require('sqs-consumer');
const crypto = require('crypto');
AWS.config.update({region: 'us-east-1'});
const https = require('https');
const http = require("http");
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

let result = [];
async function sendMessages(queueUrl, reqbody) {
        try {
            console.log("queue reqbody is ", reqbody);
            for(let i= 0; i<reqbody.imageUrl.length; i++){
                let imgUrl = reqbody.imageUrl;
                let keys = reqbody.key;

                let params = {
                    QueueUrl: queueUrl,
                    Entries: []
                };

                let imageData = {
                    'imageUrl': imgUrl[i],
                    'key': keys[i],
                    'width': reqbody.width,
                    'height': reqbody.height,
                };


                params.Entries.push({
                    Id: crypto.randomBytes(15).toString('hex'),
                    MessageBody: JSON.stringify(imageData), //***must be pass as a total object
                    MessageAttributes: {
                        "imageUrl": {
                            DataType: "String",
                            StringValue: imgUrl[i]
                        },
                        "width": {
                            DataType: "Number",
                            StringValue: reqbody.width
                        },
                        "height": {
                            DataType: "Number",
                            StringValue: reqbody.height
                        },
                        "key": {
                            DataType: "String",
                            StringValue: keys[i]
                        }
                    },
                })
    
                const res = await sqs.sendMessageBatch(params).promise();
                result.push(res);
                // console.log("sendMessageBatch res is ", res);
                // console.log("result array is ", result);
            }
        } catch (error) {
            console.log("error occured sendMessageBatch ", error);
            throw new AppError('Error occured during queue push', 400);
        }
}


exports.sendImageWithResizeData = async (req, res, next) => {
    try {

    await sendMessages(process.env.AWS_SQS_URL, req.body);

    console.log("result is ", result);

    res.status(200).json({
        "message": "successfull",
        "data": result
    })

    } catch (error) {
        console.log("sqs error is ", error);
        throw new AppError('Error occured during queue push', 400);
    }
    
}

