const aws = require('aws-sdk');
const awsS3 = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');

dotenv.config();

const s3 = new awsS3.S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    region: 'eu-north-1',
});

exports.handler = function (event, context, callback) {
    const body = event.body;

    s3.putObject({
        Bucket: process.env.S3_BUCKET,
        Key: 'file_name',
        Body: body,
    }).then(response => {
        callback(null, {
            statusCode: 200,
            body: {
                message: 'File uploaded'
            }
        })
    }).catch(err => {
        console.log(err);
    });
}