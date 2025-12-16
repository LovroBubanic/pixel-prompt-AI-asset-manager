# Deployment Guide

## Prerequisites

1. **AWS CLI**: Configured with credentials
   ```bash
   aws configure
   ```

2. **AWS SAM CLI**: Install from https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html
   ```bash
   sam --version
   ```

3. **Node.js 20.x**: Required for Lambda runtime
   ```bash
   node --version
   ```

4. **OpenAI API Key**: Get from https://platform.openai.com/api-keys

## Step-by-Step Deployment

### 1. Install Backend Dependencies

```bash
cd pixel-prompt/backend
npm install
```

### 2. Build the Application

```bash
sam build
```

This will:
- Install Lambda dependencies
- Resolve template references
- Prepare artifacts for deployment

### 3. Deploy (Guided Mode - First Time)

```bash
sam deploy --guided
```

You'll be prompted for:

- **Stack Name**: `pixelprompt-stack` (or your preferred name)
- **AWS Region**: e.g., `us-east-1`
- **Parameter OpenAIApiKey**: Your OpenAI API key
- **Confirm changes before deploy**: `Y`
- **Allow SAM CLI IAM role creation**: `Y`
- **Disable rollback**: `N` (recommended)
- **Save arguments to configuration file**: `Y`

After first deployment, you can use:
```bash
sam deploy
```

### 4. Get API Gateway URL

After deployment, SAM will output the API Gateway URL:

```
Outputs:
  ApiUrl: https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod
```

Copy this URL for frontend configuration.

### 5. Update Frontend Configuration

1. Navigate to frontend directory:
```bash
cd ../frontend
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your API URL:
```
VITE_API_URL=https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod
```

### 6. Install Frontend Dependencies

```bash
npm install
```

### 7. Start Frontend Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## Updating the Deployment

### Update Code Only

```bash
sam build
sam deploy
```

### Update with New Parameters

```bash
sam deploy --parameter-overrides OpenAIApiKey=your-new-key
```

## Local Testing

### Test API Locally

```bash
sam local start-api
```

The API will be available at `http://localhost:3000`

**Note**: For local testing, you'll need to set environment variables. Create `env.json`:

```json
{
  "GenerateUploadUrlFunction": {
    "BUCKET_NAME": "your-bucket-name",
    "TABLE_NAME": "your-table-name"
  },
  "ProcessImageFunction": {
    "BUCKET_NAME": "your-bucket-name",
    "TABLE_NAME": "your-table-name",
    "OPENAI_API_KEY": "your-openai-key"
  },
  "GetImagesFunction": {
    "BUCKET_NAME": "your-bucket-name",
    "TABLE_NAME": "your-table-name"
  }
}
```

Then run:
```bash
sam local start-api --env-vars env.json
```

## Troubleshooting

### Issue: "Bucket name already exists"
- S3 bucket names are globally unique. The template uses account ID and region to make it unique.
- If it still conflicts, manually edit `template.yaml` to change the bucket name pattern.

### Issue: "OpenAI API Key not found"
- Ensure you provided the key during `sam deploy --guided`
- Or update it: `sam deploy --parameter-overrides OpenAIApiKey=your-key`

### Issue: CORS errors in browser
- Verify CORS configuration in `template.yaml` includes your frontend URL
- Check API Gateway CORS settings match S3 CORS settings

### Issue: Lambda timeout
- ProcessImage function has 30-second timeout
- For very large images, consider increasing timeout or memory in `template.yaml`

## Cleanup

To delete all resources:

```bash
sam delete
```

This will remove:
- S3 Bucket (and all images)
- DynamoDB Table (and all data)
- Lambda Functions
- API Gateway
- IAM Roles

**Warning**: This is irreversible. Make sure to backup any important data first.

## Cost Estimation

Approximate monthly costs (varies by usage):

- **DynamoDB**: Pay-per-request, ~$0.25 per million reads/writes
- **S3**: ~$0.023 per GB storage, $0.005 per 1,000 requests
- **Lambda**: First 1M requests free, then $0.20 per 1M requests
- **API Gateway**: First 1M requests free, then $3.50 per 1M requests
- **OpenAI API**: ~$0.15 per 1M input tokens, $0.60 per 1M output tokens (gpt-4o-mini)

For light usage (< 1000 images/month): ~$5-10/month
For moderate usage (10,000 images/month): ~$20-50/month

