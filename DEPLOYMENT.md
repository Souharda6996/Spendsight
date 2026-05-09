# SpendSight Vercel Deployment Guide

Deploying SpendSight to Vercel is a straightforward process, but it requires careful configuration of environment variables to ensure all features (AI Analysis, Database, Rate Limiting, and Email) work correctly.

## 1. Prepare Your Repository
Ensure your latest code is pushed to a GitHub repository.
1. Initialize git (if not already): `git init`
2. Add all files: `git add .`
3. Commit: `git commit -m "Prepare for deployment"`
4. Push to a new GitHub repository:
   ```bash
   git remote add origin https://github.com/yourusername/spendsight.git
   git branch -M main
   git push -u origin main
   ```

## 2. Connect to Vercel
1. Go to [Vercel](https://vercel.com/) and log in with your GitHub account.
2. Click **"Add New..."** > **"Project"**.
3. Import your `spendsight` repository.

## 3. Configure Project Settings
Vercel will automatically detect that this is a **Next.js** project.
- **Framework Preset**: Next.js
- **Root Directory**: `./` (Leave as default)
- **Build and Output Settings**: Leave as default.

## 4. Set Up Environment Variables (CRITICAL)
Expand the **"Environment Variables"** section and add the following keys from your `.env.local.example`. You can copy-paste them directly or add them one by one.

| Variable Name | Description |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Project Anon Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase Service Role Key (Keep secret) |
| `RESEND_API_KEY` | API Key from Resend.com for emails |
| `ANTHROPIC_API_KEY` | API Key from Anthropic for Claude AI analysis |
| `UPSTASH_REDIS_REST_URL` | URL from Upstash Console (for rate limiting) |
| `UPSTASH_REDIS_REST_TOKEN` | Token from Upstash Console |
| `NEXT_PUBLIC_APP_URL` | Set to your Vercel production URL (e.g., `https://spendsight.vercel.app`) |

> [!TIP]
> For `NEXT_PUBLIC_APP_URL`, you can initially use the Vercel-provided URL. If you don't know it yet, you can update this variable after the first deployment.

## 5. Deploy
1. Click **"Deploy"**.
2. Vercel will start the build process. This usually takes 1-3 minutes.
3. Once finished, you will see a preview of your live site!

## 6. Post-Deployment Checks
- **Verify AI Analysis**: Go to the audit form and run a test audit to ensure the Anthropic API is responding.
- **Check Database**: Ensure form submissions are being saved to Supabase.
- **Rate Limiting**: Check if Upstash is correctly tracking requests (if implemented in your API routes).
- **SSL**: Vercel automatically provides SSL (HTTPS) for your site.

## Common Troubleshooting
- **Build Errors**: If the build fails, check the logs in Vercel. Most errors are due to missing environment variables or TypeScript errors.
- **API 500 Errors**: Usually caused by incorrect API keys (Anthropic/Resend) or Supabase permissions. Ensure your keys are correctly pasted without extra spaces.
- **Tailwind 4 Issues**: Ensure `postcss.config.mjs` and `package.json` have the correct Tailwind 4 dependencies as provided in the codebase.

## Updating the Site
Whenever you push new code to your GitHub `main` branch, Vercel will automatically trigger a new deployment. No manual steps are needed!
