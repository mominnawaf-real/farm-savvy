# Vercel Deployment Guide

## Environment Variables Setup

### Backend Environment Variables

Set these in Vercel Dashboard > Project Settings > Environment Variables:

```
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-production-jwt-secret
CORS_ORIGIN=https://your-frontend-domain.vercel.app
NODE_ENV=production
PORT=5000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_SALT_ROUNDS=10
```

### Frontend Environment Variables

For the frontend, create these environment variables:

```
VITE_API_URL=https://your-backend-domain.vercel.app/api
```

## How to Set Environment Variables

1. **Via Vercel Dashboard:**
   - Go to your project on vercel.com
   - Navigate to Settings → Environment Variables
   - Add each variable with appropriate values
   - Choose which environments (Production/Preview/Development)

2. **Via Vercel CLI:**
   ```bash
   vercel env add MONGODB_URI production
   vercel env add JWT_SECRET production
   # etc...
   ```

3. **For Local Development:**
   - Copy `.env.example` to `.env`
   - Fill in your local development values

## Important Notes

- Never commit `.env` files to git
- Use different values for production vs development
- For `CORS_ORIGIN`, use your actual frontend URL in production
- Generate a strong `JWT_SECRET` for production
- Keep MongoDB credentials secure