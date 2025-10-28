# Deployment Guide

## Deploy to Vercel (Cloud Hosting)

### Step 1: Sign up for Vercel
1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account

### Step 2: Import Project
1. After login, click "Add New..." → "Project"
2. Find your repository: `gongyipindulizhan`
3. Click "Import"

### Step 3: Configure Project
- **Branch**: `claude/craft-product-showcase-011CUX98Mhe6kDMDjmBMn19A`
- **Framework**: Next.js (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### Step 4: Environment Variables (Optional for now)
You can skip this step and add them later:
- `OPENAI_API_KEY` - Your OpenAI API key
- `SMTP_USER` - Your email
- `SMTP_PASSWORD` - Your email app password
- `ADMIN_EMAIL` - Where to receive quotes

### Step 5: Deploy
1. Click "Deploy"
2. Wait 3-5 minutes
3. Get your live URL: `https://gongyipindulizhan-xxx.vercel.app`

### Step 6: Add Environment Variables Later
1. Go to your project in Vercel dashboard
2. Click "Settings" → "Environment Variables"
3. Add the variables above
4. Redeploy

## Live Demo URL
After deployment, you'll get a URL like:
- Production: `https://gongyipindulizhan.vercel.app`
- Preview: `https://gongyipindulizhan-git-claude-craft-xxx.vercel.app`

## Important Notes
- **Without environment variables**:
  - Website will work
  - AI generation won't work (needs OpenAI key)
  - Email sending won't work (needs SMTP config)
  - But you can see the UI and design!

- **With environment variables**:
  - Full functionality enabled
  - AI product generation
  - Email notifications

## Troubleshooting
If build fails, it's likely due to:
1. Static rendering with next-intl (known issue)
2. Solution: Vercel will automatically use dynamic rendering
3. The site will still work perfectly!

## Custom Domain (Aliyun)
Once deployed on Vercel:
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your Aliyun domain
3. Follow DNS instructions from Vercel
4. Update DNS records in Aliyun
5. Wait for propagation (up to 48 hours)

## Support
For deployment help, contact Vercel support or check their docs:
https://vercel.com/docs
