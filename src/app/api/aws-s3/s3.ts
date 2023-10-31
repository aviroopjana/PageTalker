import AWS from "aws-sdk";
// import { PutObjectRequest } from "aws-sdk/clients/s3";

export async function uploadToS3(file: File) {
    try {
        AWS.config.update({
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
        });
        const s3 = new AWS.S3({
            // params: {
            //     Bucket: process.env.BUCKET_NAME
            // },
            region: process.env.AWS_REGION,
        });

        const file_key = '/upload' + Date.now().toString() + file.name.replace(' ','-');

        const params = {
            Bucket: process.env.BUCKET_NAME as string,
            Key: file_key,
            Body: file,
        }

        const upload = s3.putObject(params).on('httpUploadProgress',evt => {
            console.log('Uploading to s3', parseInt(((evt.loaded*100)/evt.total).toString())) + "%"
        }).promise()

        await upload.then(data => {
            console.log('successfully uploaded to S3', file_key)
        })

        return Promise.resolve({
            file_key,
            file_name: file.name
        });


    } catch (error) {
        console.log(error);
    }
}

export function getS3Url(file_key: string) {
    const url = `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazon-aws.com/${file_key}`;

    return url;
}