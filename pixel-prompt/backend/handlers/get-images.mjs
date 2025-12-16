import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' }));
const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
const TABLE_NAME = process.env.TABLE_NAME;
const BUCKET_NAME = process.env.BUCKET_NAME;

export const handler = async (event) => {
  try {
    // Parse query parameters
    const userId = event.queryStringParameters?.userId || 'default-user';
    const limit = parseInt(event.queryStringParameters?.limit || '50', 10);

    // Scan DynamoDB table
    const scanCommand = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      Limit: limit,
    });

    const result = await dynamoClient.send(scanCommand);

    // Sort by timestamp (newest first)
    const items = (result.Items || []).sort((a, b) => {
      return parseInt(b.timestamp) - parseInt(a.timestamp);
    });

    // Generate presigned URLs for images
    const itemsWithPresignedUrls = await Promise.all(
      items.map(async (item) => {
        if (item.s3Key && BUCKET_NAME) {
          try {
            const command = new GetObjectCommand({
              Bucket: BUCKET_NAME,
              Key: item.s3Key,
            });
            const presignedUrl = await getSignedUrl(s3Client, command, {
              expiresIn: 3600, // 1 hour
            });
            return {
              ...item,
              s3Url: presignedUrl,
            };
          } catch (error) {
            console.error(`Error generating presigned URL for ${item.s3Key}:`, error);
            return item; // Return original item if presigned URL generation fails
          }
        }
        return item;
      })
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        images: itemsWithPresignedUrls,
        count: itemsWithPresignedUrls.length,
      }),
    };
  } catch (error) {
    console.error('Error fetching images:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Failed to fetch images',
        message: error.message,
      }),
    };
  }
};

