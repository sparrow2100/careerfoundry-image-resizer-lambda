const sharp = require("sharp");
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const s3 = new S3Client({
  region: "us-east-1",
});

exports.handler = async function (event, context) {
  // should take an image in an S3 bucket, resize it,
  //and put the resized version back in the S3 bucket

  //get the bucket name and object key from the event
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = record.s3.object.key;

    //check the prefix of the object key
    const originalPrefix = "original-images/";
    const resizedPrefix = "resized-images/";

    if (!key.startsWith(originalPrefix)) {
      return;
    }

    //set the parameters
    const params = {
      Bucket: bucket,
      Key: key,
    };

    // Get the image from the S3 bucket
    const getImageCommand = new GetObjectCommand(params);
    const image = await s3.send(getImageCommand);

    // make the data readable (stream --> buffer)

    const streamToBuffer = (stream) => {
      return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
      });
    };

    const imageBuffer = await streamToBuffer(image.Body);

    // resize the image using sharp module
    const resizedImage = await sharp(imageBuffer)
      .resize({ width: 200 })
      .toBuffer();

    const resizedKey = `${resizedPrefix}${key.substring(
      originalPrefix.length
    )}`;
    const uploadParams = {
      Bucket: bucket,
      Key: resizedKey,
      Body: resizedImage,
      ContentType: "image/jpeg",
    };

    //upload resized image
    const putImageCommand = new PutObjectCommand(uploadParams);
    await s3.send(putImageCommand);
  }
};
