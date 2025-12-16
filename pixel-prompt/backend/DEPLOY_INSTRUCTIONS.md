# Deployment Instructions

## Step 1: Set AWS Credentials

You have two options:

### Option A: Use the PowerShell Script (Easiest)

1. Run the script:
   ```powershell
   .\set-aws-credentials.ps1
   ```

2. Enter your credentials when prompted:
   - AWS Access Key ID
   - AWS Secret Access Key (will be hidden)
   - AWS Region (press Enter for default: eu-north-1)

### Option B: Set Environment Variables Manually

```powershell
$env:AWS_ACCESS_KEY_ID="your-access-key-id"
$env:AWS_SECRET_ACCESS_KEY="your-secret-access-key"
$env:AWS_DEFAULT_REGION="eu-north-1"
```

## Step 2: Verify Credentials

```powershell
# If AWS CLI is installed:
aws sts get-caller-identity

# Or test with SAM:
sam deploy --no-execute-changeset
```

## Step 3: Deploy

```powershell
sam deploy
```

The deployment will use:
- Stack name: `pixelprompt` (from samconfig.toml)
- Region: `eu-north-1` (or what you set)
- OpenAI API Key: Already saved in samconfig.toml

## Getting AWS Credentials

If you don't have AWS credentials:

1. Log in to AWS Console: https://console.aws.amazon.com
2. Go to IAM → Users → Your username → Security credentials
3. Click "Create access key"
4. Choose "Command Line Interface (CLI)"
5. Download or copy both keys (Secret is shown only once!)

## Troubleshooting

### "Unable to locate credentials"
- Make sure you ran `set-aws-credentials.ps1` or set environment variables
- Credentials are only valid for the current PowerShell session
- Close and reopen PowerShell if needed

### "Access Denied"
- Check your IAM user has permissions to create Lambda, S3, DynamoDB, API Gateway
- You may need AdministratorAccess or specific permissions

### "OpenAI API Key missing"
- Check `samconfig.toml` has the parameter override
- Or set it manually: `sam deploy --parameter-overrides OpenAIApiKey="sk-your-key"`

