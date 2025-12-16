import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
const BUCKET_NAME = process.env.BUCKET_NAME;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const PRESIGNED_URL_EXPIRY = 300; // 5 minutes

export const handler = async (event) => {
  try {
    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const { fileName, fileType, fileSize, userId = 'default-user' } = body;

    // Validate inputs
    if (!fileName || !fileType || !fileSize) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Missing required fields: fileName, fileType, fileSize',
        }),
      };
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(fileType.toLowerCase())) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Invalid file type. Only JPEG and PNG images are allowed.',
        }),
      };
    }

    // Validate file size
    if (fileSize > MAX_FILE_SIZE) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        }),
      };
    }

    // Generate unique S3 key
    const timestamp = Date.now();
    const randomId = crypto.randomBytes(8).toString('hex');
    const fileExtension = fileName.split('.').pop().toLowerCase();
    const s3Key = `uploads/${userId}/${timestamp}-${randomId}.${fileExtension}`;

    // Create presigned URL
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      ContentType: fileType,
      ContentLength: fileSize,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: PRESIGNED_URL_EXPIRY,
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        uploadUrl: presignedUrl,
        s3Key: s3Key,
        expiresIn: PRESIGNED_URL_EXPIRY,
      }),
    };
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Failed to generate upload URL',
        message: error.message,
      }),
    };
  }
};

