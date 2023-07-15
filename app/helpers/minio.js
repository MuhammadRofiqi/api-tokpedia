require("dotenv").config();
const Minio = require("minio");

const client = new Minio.Client({
  endPoint: process.env.S3_ENDPOINT,
  port: 443,
  useSSL: true,
  accessKey: process.env.S3_ACCESS_KEY,
  secretKey: process.env.S3_SECRET_KEY
});

module.exports = client;