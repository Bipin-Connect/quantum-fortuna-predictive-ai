# Quantum Fortuna™ Deployment Guide

## 🚀 Automated CI/CD Setup (Updated August 29, 2025)

Your Quantum Fortuna™ repository now includes automated CI/CD pipelines for seamless deployment and quality assurance with enhanced lottery data integration.

### 📋 Prerequisites

Before the automation works, you need to configure these secrets in your GitHub repository:

1. **Go to your GitHub repository**
2. **Navigate to Settings → Secrets and variables → Actions**
3. **Add the following repository secrets:**

#### Required Secrets:

```
NETLIFY_AUTH_TOKEN=your_netlify_personal_access_token
NETLIFY_SITE_ID=your_netlify_site_id
```

### 🔧 Getting Netlify Credentials

#### 1. Netlify Auth Token:
- Go to [Netlify Dashboard](https://app.netlify.com/)
- Click on your profile → User settings
- Go to Applications → Personal access tokens
- Generate new token → Copy the token
- Add as `NETLIFY_AUTH_TOKEN` in GitHub secrets

#### 2. Netlify Site ID:
- Go to your Netlify site dashboard
- Navigate to Site settings → General
- Copy the Site ID (under Site details)
- Add as `NETLIFY_SITE_ID` in GitHub secrets

### 🔄 Automated Workflows

#### 1. **Main Deployment** (`.github/workflows/deploy.yml`)
- **Triggers**: Push to main/master branch
- **Actions**: Build, test, and deploy to production
- **Features**: Automatic Netlify deployment with commit messages

#### 2. **Quality Assurance** (`.github/workflows/quality-check.yml`)
- **Triggers**: All pushes and pull requests
- **Actions**: TypeScript check, linting, security audit, build verification
- **Features**: Bundle size analysis and performance monitoring

#### 3. **Daily Predictions Update** (`.github/workflows/update-predictions.yml`)
- **Triggers**: Daily at 9:15 AM IST (scheduled) + manual trigger
- **Actions**: Updates prediction algorithms and data
- **Features**: Automated commits with timestamp

### 🎯 Deployment Process

1. **Push to GitHub**: Any push to main branch triggers deployment
2. **Automatic Build**: GitHub Actions builds the application with latest lottery data
3. **Quality Checks**: Runs linting, type checking, prediction validation, and security audits
4. **Deploy to GitHub Pages**: Automatically deploys to your live site
5. **Audit Trail**: Updates deployment history with SHA tags and timestamps
6. **Verification**: Real-time deployment status monitoring

### 📊 Monitoring

- **Build Status**: Visible in GitHub Actions tab
- **Deploy Status**: Check GitHub Pages deployment status
- **Performance**: Bundle size tracking in workflow logs
- **Security**: Automated vulnerability scanning
- **Prediction Accuracy**: Automated validation of lottery data sources

### 🔧 Manual Deployment

If you need to deploy manually:

```bash
# Build the project
npm run build

# Deploy to GitHub Pages (handled automatically by CI/CD)
git push origin main
```

### 🎨 Branch Protection (Recommended)

Set up branch protection rules in GitHub:
1. Go to Settings → Branches
2. Add rule for main/master branch
3. Enable "Require status checks to pass"
4. Select the quality-check workflow

### 🚀 Next Steps

1. **Monitor the automated deployment** via GitHub Actions
2. **Push any change** to trigger the first automated deployment
3. **Monitor the Actions tab** to see the workflows in action
4. **Check the live site** for real-time updates
5. **Review DEPLOY_HISTORY.md** for audit trail verification
