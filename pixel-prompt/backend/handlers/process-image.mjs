import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';

const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' }));
const BUCKET_NAME = process.env.BUCKET_NAME;
const TABLE_NAME = process.env.TABLE_NAME;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Initialize OpenAI client
const chatModel = new ChatOpenAI({
  modelName: 'gpt-4o-mini',
  temperature: 0.7,
  openAIApiKey: OPENAI_API_KEY,
});

export const handler = async (event) => {
  try {
    // Parse S3 event
    const records = event.Records || [];
    
    for (const record of records) {
      if (record.eventSource !== 'aws:s3') {
        continue;
      }

      const bucket = record.s3.bucket.name;
      const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

      console.log(`Processing image: ${key} from bucket: ${bucket}`);

      // Download image from S3
      const getObjectCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      const s3Object = await s3Client.send(getObjectCommand);
      const imageBuffer = await streamToBuffer(s3Object.Body);

      // Convert to base64
      const base64Image = imageBuffer.toString('base64');
      const imageDataUrl = `data:${s3Object.ContentType};base64,${base64Image}`;

      // Analyze image with OpenAI Vision
      const analysisPrompt = `Analyze this image and provide a JSON response with the following structure:
{
  "title": "A concise, descriptive title for the image (max 60 characters)",
  "caption": "A detailed caption describing the image content, style, and key elements (2-3 sentences)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

Focus on:
- Visual content (objects, people, scenes, colors, composition)
- Style and mood
- SEO-friendly tags (use lowercase, no spaces, descriptive keywords)
- Return ONLY valid JSON, no markdown formatting or additional text`;

      const messages = [
        new HumanMessage({
          content: [
            {
              type: 'text',
              text: analysisPrompt,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageDataUrl,
              },
            },
          ],
        }),
      ];

      const response = await chatModel.invoke(messages);
      let analysisResult;

      // Parse the response (handle both JSON and markdown-wrapped JSON)
      try {
        const content = response.content.trim();
        // Remove markdown code blocks if present
        const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        analysisResult = JSON.parse(jsonContent);
      } catch (parseError) {
        console.error('Failed to parse OpenAI response:', response.content);
        // Fallback response
        analysisResult = {
          title: 'Untitled Image',
          caption: 'Image analysis unavailable',
          tags: ['image'],
        };
      }

      // Extract metadata
      const userId = key.split('/')[1] || 'default-user';
      const timestamp = Date.now().toString();
      const s3Url = `https://${bucket}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;

      // Save to DynamoDB
      const item = {
        userId: userId,
        timestamp: timestamp,
        s3Key: key,
        s3Url: s3Url,
        fileName: key.split('/').pop(),
        contentType: s3Object.ContentType,
        fileSize: s3Object.ContentLength,
        title: analysisResult.title || 'Untitled Image',
        caption: analysisResult.caption || '',
        tags: analysisResult.tags || [],
        createdAt: new Date().toISOString(),
        processedAt: new Date().toISOString(),
      };

      await dynamoClient.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: item,
        })
      );

      console.log(`Successfully processed and saved image: ${key}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Images processed successfully' }),
    };
  } catch (error) {
    console.error('Error processing image:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to process image',
        message: error.message,
      }),
    };
  }
};

// Helper function to convert stream to buffer
async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

