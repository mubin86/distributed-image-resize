require('dotenv').config();
const AppError = require('./../utils/appError');
const AWS = require("aws-sdk");
const crypto = require('crypto');
AWS.config.update({region: 'us-east-1'});
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

let result = [];
async function sendMessages(queueUrl, reqbody) {
        try {
            for(let i= 0; i<reqbody.imageUrl.length; i++){
                let imgUrl = reqbody.imageUrl;
                let params = {
                    QueueUrl: queueUrl,
                    Entries: []
                };
    
                params.Entries.push({
                    Id: crypto.randomBytes(15).toString('hex'),
                    MessageBody: 'iamge with resize data',
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
                        }
                    },
                })
    
                const res = await sqs.sendMessageBatch(params).promise();
                result.push(res);
                console.log("sendMessageBatch res is ", res);
            }
        } catch (error) {
            console.log("error occured sendMessageBatch ", error);
            throw new AppError('Error occured during queue push', 400);
        }
}


exports.sendImageWithResizeData = async (req, res, next) => {
    try {
    //     let params = {
    //         // DelaySeconds: 10,
            // MessageAttributes: {
            // "imageUrl": {
            //     DataType: "String",
            //     StringValue: req.body.imageUrl
            // },
            // "width": {
            //     DataType: "Number",
            //     StringValue: "300"
            // },
            // "height": {
            //     DataType: "Number",
            //     StringValue: "300"
            // }
            // },
    //     MessageBody: 'Information of image with resize data',
    //     QueueUrl: process.env.AWS_SQS_URL
    // };

    // sqs.sendMessage(params, (err, data) => {
    //     if(err){
    //         console.log("sqs error is ", err);
    //         throw new AppError('Error occured during queue push', 400);
    //     }else{
    //         console.log("Succesfully sent to queue", data);
    //     }

    //     res.status(200).json({
    //         "message": "successfully sent to queue",
    //         "data": data
    //     })
        
    // })
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