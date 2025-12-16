# PixelPrompt - Quick Start Guide

Get PixelPrompt up and running in 5 minutes!

## Quick Setup

### Backend (5 minutes)

```bash
cd pixel-prompt/backend
npm install
sam build
sam deploy --guided
# Follow prompts, provide OpenAI API key when asked
```

**Copy the API URL** from the deployment output.

### Frontend (2 minutes)

```bash
cd pixel-prompt/frontend
npm install

# Create .env file
echo "VITE_API_URL=https://your-api-url.execute-api.region.amazonaws.com/prod" > .env

npm run dev
```

Visit `http://localhost:5173` and start uploading images!

## What Happens When You Upload?

1. **Upload**: Image is uploaded directly to S3 via presigned URL
2. **Trigger**: S3 event triggers Lambda function
3. **Analysis**: Lambda uses OpenAI Vision API to analyze the image
4. **Storage**: Results (title, caption, tags) saved to DynamoDB
5. **Display**: Frontend polls and displays processed images

## Requirements

- AWS Account with CLI configured
- AWS SAM CLI installed (`sam --version`)
- Node.js 20.x
- OpenAI API Key ([get one here](https://platform.openai.com/api-keys))

## Need Help?

See [README.md](README.md) for detailed documentation or [backend/DEPLOYMENT.md](pixel-prompt/backend/DEPLOYMENT.md) for deployment troubleshooting.

