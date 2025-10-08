const {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
} = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadToS3(file) {
  const fileName = `${uuidv4()}-${file.originalname}`;
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  await s3.send(new PutObjectCommand(params));
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
}

// New: delete files from S3
async function deleteFromS3(fileUrls = []) {
  if (!fileUrls.length) return;

  // Extract the keys (filenames) from the URLs
  const objects = fileUrls.map((url) => {
    const parts = url.split("/");
    const key = parts[parts.length - 1];
    return { Key: key };
  });

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Delete: { Objects: objects },
  };

  await s3.send(new DeleteObjectsCommand(params));
}

module.exports = { uploadToS3, deleteFromS3 };
