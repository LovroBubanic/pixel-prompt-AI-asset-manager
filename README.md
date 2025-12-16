# PixelPrompt - AI Asset Manager

A serverless AI-powered image asset management SaaS built with AWS SAM, React, and OpenAI Vision API.

## Architecture Overview

PixelPrompt uses a modern serverless architecture:

- **Frontend**: React + TypeScript + Tailwind CSS (Vite) with modern glassmorphism UI
- **Backend**: AWS SAM (Serverless Application Model)
- **Storage**: Amazon S3 (with event-driven processing)
- **Database**: Amazon DynamoDB (On-Demand)
- **Compute**: AWS Lambda (Node.js 20.x)
- **AI**: LangChain JS with OpenAI Vision

## Features

- **Modern UI Design**: Beautiful glassmorphism interface with gradient accents and smooth animations
- **Direct S3 Upload**: Uses presigned URLs for fast, secure image uploads
- **Automatic AI Analysis**: Images are automatically analyzed using OpenAI Vision API
- **SEO-Friendly Metadata**: Generates titles, captions, and tags for each image
- **Real-time Gallery**: Auto-refreshing gallery with polling (every 3 seconds)
- **Per-Browser Isolation**: Each browser session gets a unique user ID stored in localStorage
- **Presigned Image URLs**: Secure, time-limited URLs for viewing images
- **Responsive Design**: Modern, mobile-friendly interface built with Tailwind CSS
- **Drag & Drop Upload**: Intuitive file upload with visual feedback

## Project Structure

```
pixel-prompt/
├── backend/              # AWS SAM backend
│   ├── handlers/         # Lambda function handlers
│   │   ├── generate-url.mjs    # Generates presigned URLs for uploads
│   │   ├── process-image.mjs   # Processes images with OpenAI Vision
│   │   └── get-images.mjs      # Retrieves images with presigned URLs
│   ├── template.yaml     # SAM template
│   ├── package.json
│   └── samconfig.toml    # SAM deployment configuration
└── frontend/             # React frontend
    ├── src/
    │   ├── components/   # React components
    │   │   ├── ImageUpload.tsx
    │   │   └── ImageGallery.tsx
    │   ├── hooks/        # Custom React hooks
    │   │   ├── useImageUpload.ts
    │   │   └── useImageGallery.ts
    │   ├── types.ts      # TypeScript type definitions
    │   └── config.ts     # API configuration & user ID management
    ├── index.html
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- AWS CLI configured with credentials
- AWS SAM CLI installed
- OpenAI API Key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd pixel-prompt/backend
```

2. Install dependencies:
```bash
npm install
```

3. Build the SAM application:
```bash
sam build
```

4. Deploy (guided mode - first time):
```bash
sam deploy --guided
```

During deployment, you'll need to provide:
- Stack name (e.g., `pixelprompt`)
- AWS Region (e.g., `eu-north-1`)
- OpenAI API Key

After deployment, note the API Gateway URL from the outputs. It will look like:
```
https://xxxxx.execute-api.region.amazonaws.com/Prod
```

**Note**: For subsequent deployments, you can use `sam deploy` directly.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd pixel-prompt/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
# Create .env file manually or copy from .env.example
```

4. Update `.env` with your API Gateway URL:
```env
VITE_API_URL=https://your-api-id.execute-api.region.amazonaws.com/Prod
```

**Important**: Use `/Prod` (capital P) not `/prod` - this matches the SAM template stage name.

5. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Usage

1. **Upload an Image**: 
   - Click the upload area or drag and drop an image
   - Supported formats: JPG/PNG
   - Maximum size: 2MB

2. **Automatic Processing**: 
   - Image is uploaded directly to S3 via presigned URL
   - S3 event triggers the ProcessImage Lambda function
   - Processing typically takes 10-30 seconds

3. **AI Analysis**: 
   - Lambda function downloads the image from S3
   - Sends to OpenAI Vision API for analysis
   - Generates title, caption, and SEO tags

4. **View Results**: 
   - Gallery automatically refreshes every 3 seconds
   - Images appear with AI-generated metadata
   - Click captions to expand full text
   - Images are displayed using secure presigned URLs

## User Isolation

Each browser session automatically gets a unique user ID stored in localStorage:
- **First visit**: Generates a unique ID (e.g., `user-1734567890123-abc123xyz`)
- **Persistent**: ID persists across page refreshes
- **Isolated**: Each browser/device sees only their own images
- **Note**: Clearing browser data will generate a new user ID

## API Endpoints

### `POST /get-upload-url`
Generate presigned URL for S3 upload.

**Request Body:**
```json
{
  "fileName": "image.jpg",
  "fileType": "image/jpeg",
  "fileSize": 1024000,
  "userId": "user-1234567890-abc123"
}
```

**Response:**
```json
{
  "uploadUrl": "https://s3.amazonaws.com/...",
  "s3Key": "uploads/user-123/1234567890-abc123.jpg",
  "expiresIn": 300
}
```

### `GET /get-images`
Retrieve all processed images for a user.

**Query Parameters:**
- `userId` (optional, defaults to `default-user`)
- `limit` (optional, defaults to 50)

**Response:**
```json
{
  "images": [
    {
      "userId": "user-123",
      "timestamp": "1734567890123",
      "s3Key": "uploads/user-123/1234567890-abc123.jpg",
      "s3Url": "https://s3.amazonaws.com/...?presigned-url",
      "fileName": "image.jpg",
      "title": "AI Generated Title",
      "caption": "Detailed caption...",
      "tags": ["tag1", "tag2", "tag3"],
      "createdAt": "2024-12-16T10:00:00.000Z",
      "processedAt": "2024-12-16T10:00:15.000Z"
    }
  ],
  "count": 1
}
```

## Configuration

### Environment Variables

**Backend (Lambda)**:
- `BUCKET_NAME`: S3 bucket name (auto-set by SAM)
- `TABLE_NAME`: DynamoDB table name (auto-set by SAM)
- `OPENAI_API_KEY`: Your OpenAI API key (set during deployment)

**Frontend**:
- `VITE_API_URL`: API Gateway endpoint URL (set in `.env` file)

### File Constraints

- Maximum file size: 2MB
- Allowed types: JPEG, JPG, PNG
- OpenAI model: Uses OpenAI Vision API (gpt-4o-mini under the hood)

## UI Design

The frontend features a modern, eye-catching design:

- **Glassmorphism**: Frosted glass effects on cards and components
- **Gradient Backgrounds**: Dark gradient with animated blur orbs
- **Smooth Animations**: Fade-in, hover effects, and transitions
- **Gradient Accents**: Indigo, purple, and pink color scheme
- **Responsive Layout**: Works beautifully on desktop, tablet, and mobile
- **Modern Typography**: Plus Jakarta Sans font for a professional look

## Development

### Local Backend Testing

```bash
cd pixel-prompt/backend
sam local start-api
```

**Note**: For local testing, you may need to set environment variables or use `--env-vars` flag.

### Frontend Development

```bash
cd pixel-prompt/frontend
npm run dev
```

The dev server supports hot module replacement (HMR) for instant updates.

## Deployment

### Backend

```bash
cd pixel-prompt/backend
sam build
sam deploy
```

**Note**: After first deployment with `--guided`, subsequent deployments use saved configuration from `samconfig.toml`.

### Frontend

Build for production:
```bash
cd pixel-prompt/frontend
npm run build
```

Deploy the `dist/` folder to your hosting service:
- **Vercel**: Connect your GitHub repo or use Vercel CLI
- **Netlify**: Drag and drop the `dist` folder or use Netlify CLI
- **AWS S3 + CloudFront**: Upload to S3 bucket and configure CloudFront distribution

**Important**: Set the `VITE_API_URL` environment variable in your hosting platform.

## Security Considerations

- **Presigned URLs**: Expire after 5 minutes (uploads) and 1 hour (image viewing)
- **File Validation**: Type and size validation on both client and server
- **CORS**: Configured for development and production origins
- **IAM Roles**: Follow least privilege principle
- **User Isolation**: Per-browser user IDs prevent cross-user data access
- **API Keys**: OpenAI API key stored as environment variable (consider AWS Secrets Manager for production)

## Troubleshooting

### CORS Errors
- Ensure API Gateway URL in `.env` is correct
- Check that CORS is configured in `template.yaml`
- Verify the stage name matches (`/Prod` not `/prod`)

### Images Not Displaying
- Check browser console for errors
- Verify presigned URLs are being generated (check `get-images` Lambda logs)
- Ensure S3 bucket permissions allow Lambda to read objects

### S3 Event Trigger Not Working
- Verify S3 bucket notification is configured (may need manual setup if circular dependency occurred)
- Check CloudWatch logs for `ProcessImageFunction`
- Ensure Lambda function has S3 read permissions

### User ID Issues
- Check browser localStorage is enabled
- Private browsing mode may use session-based IDs
- Clearing browser data will generate a new user ID

## Cost Optimization

- **DynamoDB**: On-Demand billing (pay per request)
- **S3**: Standard storage with lifecycle policies possible
- **Lambda**: 30-second timeout, optimized memory allocation
- **API Gateway**: Pay per request (first 1M requests free)
- **OpenAI**: Uses cost-efficient Vision API model

**Estimated Monthly Cost** (light usage < 1000 images):
- AWS Services: ~$5-10/month
- OpenAI API: ~$5-15/month
- **Total**: ~$10-25/month

## License

MIT
