# Installing AWS SAM CLI on Windows

## Option 1: Using MSI Installer (Recommended)

1. **Download the installer**:
   - Visit: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html
   - Download the Windows MSI installer (64-bit)

2. **Run the installer**:
   - Double-click the downloaded `.msi` file
   - Follow the installation wizard
   - Make sure to check "Add SAM CLI to PATH" if prompted

3. **Verify installation**:
   ```powershell
   sam --version
   ```
   Should show: `SAM CLI, version 1.x.x`

## Option 2: Using Chocolatey (If you have it)

```powershell
choco install aws-sam-cli
```

## Option 3: Using pip (Python required)

```powershell
pip install aws-sam-cli
```

## After Installation

1. **Close and reopen PowerShell** (to refresh PATH)

2. **Verify AWS CLI is also installed**:
   ```powershell
   aws --version
   ```
   If not installed, download from: https://aws.amazon.com/cli/

3. **Configure AWS credentials** (if not already done):
   ```powershell
   aws configure
   ```
   You'll need:
   - AWS Access Key ID
   - AWS Secret Access Key
   - Default region (e.g., `us-east-1`)
   - Default output format (e.g., `json`)

4. **Test SAM CLI**:
   ```powershell
   sam --version
   sam build --help
   ```

## Troubleshooting

### "sam is not recognized"
- Close and reopen PowerShell/terminal
- Check if SAM is in PATH: `$env:PATH`
- Manually add SAM to PATH if needed

### "Docker is required"
- SAM CLI uses Docker for local testing
- Install Docker Desktop: https://www.docker.com/products/docker-desktop
- Docker is NOT required for `sam build` or `sam deploy`, only for `sam local`

### Long Path Issues
- Enable long paths in Windows:
  1. Open PowerShell as Administrator
  2. Run: `New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force`

## What You Can Do Without SAM CLI (For Now)

While installing SAM CLI, you can:

1. **Work on the frontend**:
   ```powershell
   cd ..\frontend
   npm install
   npm run dev
   ```

2. **Review the code**:
   - Check `handlers/` directory for Lambda functions
   - Review `template.yaml` for infrastructure

3. **Prepare your OpenAI API key**:
   - Get it from https://platform.openai.com/api-keys
   - Keep it ready for deployment

Once SAM CLI is installed, you can proceed with:
```powershell
sam build
sam deploy --guided
```

