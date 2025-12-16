# PixelPrompt Backend

Serverless backend for PixelPrompt AI Asset Manager built with AWS SAM.

## Prerequisites

- AWS CLI configured with appropriate credentials
- AWS SAM CLI installed (`sam --version`)
- Node.js 20.x or higher
- OpenAI API Key

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set your OpenAI API Key as an environment variable or update the template.yaml to use AWS Systems Manager Parameter Store.

3. Build the application:
```bash
sam build
```

4. Deploy the application:
```bash
sam deploy --guided
```

During guided deployment, you'll be prompted to:
- Stack name (default: pixelprompt-stack)
- AWS Region
- Confirm changes before deployment
- Allow SAM CLI to create IAM roles
- OpenAI API Key (if using parameter)

## Environment Variables

The `ProcessImage` function requires the `OPENAI_API_KEY` environment variable. You can set this during deployment or store it in AWS Systems Manager Parameter Store.

## API Endpoints

After deployment, you'll receive an API Gateway URL. The endpoints are:

- `POST /get-upload-url` - Generate a presigned URL for image upload
- `GET /get-images` - Retrieve all processed images

## Local Development

To test locally:

```bash
sam local start-api
```

Note: You'll need to set environment variables for local testing. Create a `env.json` file or use `sam local start-api --env-vars env.json`.

## Architecture

- **S3 Bucket**: Stores uploaded images
- **DynamoDB Table**: Stores image metadata and AI analysis results
- **Lambda Functions**:
  - `GenerateUploadUrl`: Creates presigned URLs for direct S3 uploads
  - `ProcessImage`: Triggered by S3 events, analyzes images with OpenAI Vision
  - `GetImages`: Retrieves images from DynamoDB

## File Structure

```
backend/
├── handlers/
│   ├── generate-url.mjs
│   ├── process-image.mjs
│   └── get-images.mjs
├── template.yaml
├── package.json
└── samconfig.toml
```

