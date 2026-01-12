# Azure AI Setup for Prompt-to-Code Similarity Analysis

This guide walks you through setting up Azure OpenAI integration for the prompt-to-code similarity analysis workflow.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Azure OpenAI Setup](#azure-openai-setup)
- [GitHub Secrets Configuration](#github-secrets-configuration)
- [Verification](#verification)
- [Model Selection Guide](#model-selection-guide)
- [Cost Estimation](#cost-estimation)
- [Troubleshooting](#troubleshooting)
- [Security Best Practices](#security-best-practices)

## Prerequisites

- **Azure Subscription**: Active Azure subscription with OpenAI service access
- **GitHub Repository**: Admin access to configure repository secrets
- **Azure Portal Access**: Ability to create and manage Azure resources

## Azure OpenAI Setup

### Step 1: Create Azure OpenAI Resource

1. Navigate to the [Azure Portal](https://portal.azure.com)
2. Click **"Create a resource"**
3. Search for **"Azure OpenAI"**
4. Click **"Create"**
5. Fill in the required details:
   - **Subscription**: Select your subscription
   - **Resource Group**: Create new or select existing
   - **Region**: Choose a region (e.g., East US, West Europe)
   - **Name**: Enter a unique name (e.g., `co-own-openai`)
   - **Pricing Tier**: Select Standard S0
6. Click **"Review + create"** then **"Create"**
7. Wait for deployment to complete

### Step 2: Deploy a Model in Azure AI Foundry

1. Once the resource is created, click **"Go to resource"**
2. In the left menu, click **"Model deployments"** or use Azure AI Foundry
3. Click **"Create new deployment"** or **"+ Create"**
4. Select a model:
   - **Recommended**: `gpt-4o` (best balance of performance and cost)
   - **Alternative**: `gpt-4-turbo` (higher quality, higher cost)
   - **Budget**: `gpt-35-turbo` (lower cost, acceptable quality)
5. Enter deployment details:
   - **Deployment name**: e.g., `gpt4o-deployment` (remember this!)
   - **Model version**: Select the latest available
   - **Deployment type**: Standard
6. Click **"Create"**

### Step 3: Get Your Credentials

#### Get Endpoint URL
1. In your Azure OpenAI resource, go to **"Keys and Endpoint"**
2. Copy the **"Endpoint"** value (e.g., `https://your-resource.openai.azure.com/`)
3. **Important**: Remove the trailing slash if present

#### Get API Key
1. In the same **"Keys and Endpoint"** section
2. Copy **"KEY 1"** or **"KEY 2"** (either works)
3. Keep this secure - do not share or commit to code

#### Get Deployment Name
1. Go to **"Model deployments"**
2. Note the **"Deployment name"** you created in Step 2
3. This is typically something like `gpt4o-deployment`

#### Get API Version
- Use the default: `2024-02-15-preview`
- Or check Azure documentation for latest supported versions

## GitHub Secrets Configuration

### Adding Secrets to Your Repository

1. Navigate to your GitHub repository
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"** for each of the following:

#### Required Secrets

| Secret Name | Example Value | Description |
|------------|---------------|-------------|
| `AZURE_OPENAI_ENDPOINT` | `https://your-resource.openai.azure.com` | Your Azure OpenAI endpoint (no trailing slash) |
| `AZURE_OPENAI_API_KEY` | `abc123...xyz` | Your API key from Azure portal |
| `AZURE_OPENAI_DEPLOYMENT` | `gpt4o-deployment` | Your model deployment name |
| `AZURE_API_VERSION` | `2024-02-15-preview` | API version (optional, has default) |

### Example Configuration

```bash
# Your endpoint should look like this:
AZURE_OPENAI_ENDPOINT=https://co-own-openai.openai.azure.com

# Your API key (example - use your actual key):
AZURE_OPENAI_API_KEY=1234567890abcdef1234567890abcdef

# Your deployment name:
AZURE_OPENAI_DEPLOYMENT=gpt4o-deployment

# API version (optional):
AZURE_API_VERSION=2024-02-15-preview
```

## Verification

### Test Your Setup

1. After adding secrets, run the test workflow:
   ```
   Actions → Test Azure AI Setup → Run workflow
   ```

2. The workflow will:
   - ✅ Check all required secrets are configured
   - ✅ Validate the endpoint format
   - ✅ Make a test API call to Azure OpenAI
   - ✅ Display success or detailed error messages

3. Review the workflow output for any errors

### Expected Output

**Success:**
```
✅ All Azure AI secrets configured
✅ Test API call successful
✅ Model: gpt-4o
✅ Response received correctly
```

**Failure:**
```
❌ Missing secret: AZURE_OPENAI_ENDPOINT
Or
❌ API Error: 401 Unauthorized - Check your API key
```

## Model Selection Guide

### Recommended Models

| Model | Best For | Cost | Quality | Speed |
|-------|----------|------|---------|-------|
| **gpt-4o** | Production use | Medium | Excellent | Fast |
| **gpt-4-turbo** | High accuracy needs | High | Excellent | Medium |
| **gpt-35-turbo** | Development/testing | Low | Good | Very Fast |

### Model Capabilities

**GPT-4o (Recommended)**
- Excellent code understanding
- Fast response times
- Good balance of cost and performance
- Supports 128K context window

**GPT-4 Turbo**
- Highest quality analysis
- Best for complex codebases
- Higher cost per request
- 128K context window

**GPT-3.5 Turbo**
- Budget-friendly option
- Good for simple analysis
- Faster responses
- 16K context window

## Cost Estimation

### Pricing Overview (as of 2024)

**GPT-4o:**
- Input: ~$2.50 per 1M tokens
- Output: ~$10.00 per 1M tokens

**GPT-3.5 Turbo:**
- Input: ~$0.50 per 1M tokens
- Output: ~$1.50 per 1M tokens

### Estimated Usage

**Per PR Analysis:**
- Input tokens: ~2,000-4,000 (prompt + code diff)
- Output tokens: ~1,000-2,000 (analysis report)
- Cost per analysis: $0.01 - $0.05 (GPT-4o)

**Monthly Estimate:**
- 100 PRs/month: ~$2-5
- 500 PRs/month: ~$10-25

### Cost Optimization Tips

1. **Use fallback analysis** for simple changes
2. **Limit diff size** (configured to 8000 chars)
3. **Cache similar analyses** (future enhancement)
4. **Use GPT-3.5** for development/testing
5. **Monitor usage** in Azure portal

## Troubleshooting

### Common Errors and Solutions

#### Error: Missing Required Secrets

```
❌ Missing secret: AZURE_OPENAI_ENDPOINT
```

**Solution:**
- Verify all 4 secrets are added in GitHub Settings
- Check secret names match exactly (case-sensitive)
- No leading/trailing spaces in values

#### Error: 404 Not Found

```
Resource not found: /openai/deployments/wrong-name/...
```

**Solution:**
- Verify `AZURE_OPENAI_DEPLOYMENT` matches your actual deployment name
- Check deployment exists in Azure portal
- Ensure deployment is fully created (not pending)

#### Error: 401 Unauthorized

```
401 Unauthorized - Access denied
```

**Solution:**
- Verify `AZURE_OPENAI_API_KEY` is correct
- Try regenerating the key in Azure portal
- Ensure key hasn't been revoked or expired
- Check you're using `api-key` header (not Bearer token)

#### Error: 429 Rate Limited

```
429 Too Many Requests - Rate limit exceeded
```

**Solution:**
- Azure OpenAI has rate limits per deployment
- Reduce PR frequency or increase quota
- Implement request throttling (configured in workflow)
- Contact Azure support to increase quota

#### Error: Invalid Endpoint Format

```
❌ Endpoint must start with https://
```

**Solution:**
- Ensure endpoint starts with `https://`
- Remove trailing slash: ❌ `https://example.com/` → ✅ `https://example.com`
- Use full endpoint from Azure portal

#### Fallback Analysis Triggered

```
⚠️ Azure AI unavailable, using fallback keyword analysis
```

**Causes:**
- Azure service is down
- Invalid credentials
- Network connectivity issues
- Rate limit exceeded

**Solution:**
- Check Azure service health
- Verify credentials
- Review workflow logs for specific error
- Fallback will still provide basic analysis

### Debug Mode

To enable detailed logging:

1. Add workflow secret:
   ```
   ACTIONS_STEP_DEBUG=true
   ```

2. Re-run the workflow

3. Check detailed logs for API requests/responses

## Security Best Practices

### API Key Management

✅ **DO:**
- Store keys in GitHub Secrets only
- Rotate keys regularly (every 90 days)
- Use separate keys for dev/prod
- Monitor key usage in Azure

❌ **DON'T:**
- Commit keys to code
- Share keys via email/chat
- Use production keys in development
- Log full API keys

### Access Control

1. **Limit repository access** - Only trusted contributors
2. **Enable branch protection** - Require reviews for .github changes
3. **Audit secret access** - Review GitHub audit logs
4. **Use environment protection** - For production deployments

### Network Security

- Azure OpenAI uses HTTPS (TLS 1.2+)
- No need for VPN in most cases
- Can configure IP restrictions in Azure
- Enable Azure AD authentication (advanced)

## Advanced Configuration

### Custom API Versions

To use a different API version:

1. Check [Azure OpenAI API versions](https://learn.microsoft.com/en-us/azure/ai-services/openai/reference)
2. Update `AZURE_API_VERSION` secret
3. Test with validation workflow

### Regional Deployments

For better performance, choose regions closer to your team:
- **US**: East US, South Central US
- **Europe**: West Europe, France Central
- **Asia**: Japan East, Australia East

### Multiple Deployments

For high-volume usage:
1. Create multiple deployments
2. Implement round-robin load balancing
3. Configure separate secrets for each

## Monitoring and Analytics

### Azure Portal Monitoring

1. Navigate to your Azure OpenAI resource
2. Click **"Metrics"** in left menu
3. Monitor:
   - Total calls
   - Token usage
   - Error rates
   - Latency

### GitHub Actions Analytics

- Check workflow run history
- Review artifact uploads
- Monitor similarity score trends in dashboard
- Track fallback usage frequency

### Setting Up Alerts

1. In Azure Portal, go to **"Alerts"**
2. Create alert rules for:
   - High error rates (>5%)
   - Cost exceeding budget
   - Rate limit warnings
   - Service availability

## Support Resources

### Documentation
- [Azure OpenAI Documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Azure AI Foundry](https://learn.microsoft.com/en-us/azure/ai-studio/)

### Getting Help
- **Azure Support**: [Azure Portal Support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade)
- **GitHub Issues**: Report workflow issues in repository
- **Community**: [Azure OpenAI Community](https://learn.microsoft.com/en-us/answers/tags/387/azure-openai)

### Useful Links
- [Azure OpenAI Pricing](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/)
- [Model Availability by Region](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models)
- [Rate Limits Guide](https://learn.microsoft.com/en-us/azure/ai-services/openai/quotas-limits)

---

**Questions or Issues?**
- Open an issue in this repository
- Check existing issues for similar problems
- Review Azure OpenAI service health status

*Last Updated: 2026-01-09*
