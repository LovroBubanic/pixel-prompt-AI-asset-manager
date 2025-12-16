# PowerShell script to set AWS credentials as environment variables
# Run this script before deploying: .\set-aws-credentials.ps1

Write-Host "Setting AWS Credentials..." -ForegroundColor Green
Write-Host ""

# Prompt for AWS Access Key ID
$accessKey = Read-Host "Enter your AWS Access Key ID"
if ([string]::IsNullOrWhiteSpace($accessKey)) {
    Write-Host "Error: Access Key ID cannot be empty" -ForegroundColor Red
    exit 1
}

# Prompt for AWS Secret Access Key
$secretKey = Read-Host "Enter your AWS Secret Access Key" -AsSecureString
$secretKeyPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($secretKey))
if ([string]::IsNullOrWhiteSpace($secretKeyPlain)) {
    Write-Host "Error: Secret Access Key cannot be empty" -ForegroundColor Red
    exit 1
}

# Prompt for region (default to eu-north-1)
$region = Read-Host "Enter AWS Region (default: eu-north-1)"
if ([string]::IsNullOrWhiteSpace($region)) {
    $region = "eu-north-1"
}

# Set environment variables for current session
$env:AWS_ACCESS_KEY_ID = $accessKey
$env:AWS_SECRET_ACCESS_KEY = $secretKeyPlain
$env:AWS_DEFAULT_REGION = $region

Write-Host ""
Write-Host "Credentials set successfully!" -ForegroundColor Green
Write-Host "Access Key ID: $accessKey" -ForegroundColor Cyan
Write-Host "Region: $region" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: These credentials are only set for this PowerShell session." -ForegroundColor Yellow
Write-Host "To deploy, run: sam deploy" -ForegroundColor Yellow
Write-Host ""

