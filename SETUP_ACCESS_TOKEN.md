# 🚀 Simple Setup Guide - Access Token Method

## ✅ Changes Made

The code has been updated to use **Access Token authentication** instead of OAuth. This is much simpler!

## 📝 What You Need

From your GoHighLevel Private Integration "RequestFlow":
1. ✅ **Access Token** - `pit-5974****-****-****-****98ce` (you have this!)
2. ✅ **Location ID** - (you mentioned you have this)

## 🛠️ Setup Steps

### Step 1: Copy Your Access Token

From the screenshot you showed, copy the full Access Token:
```
pit-5974****-****-****-****98ce
```

**Important:** Copy the FULL token (click to reveal if it's hidden with asterisks)

### Step 2: Update `.env.local`

Edit the `.env.local` file and paste your credentials:

```env
# Frontend API URL (keep as-is)
VITE_API_URL=/api

# Your GoHighLevel Access Token
GHL_ACCESS_TOKEN=pit-5974-PASTE-YOUR-FULL-TOKEN-HERE

# Your Location ID
GHL_LOCATION_ID=paste_your_location_id_here

# API URL (keep as-is)
GHL_API_URL=https://services.leadconnectorhq.com
```

### Step 3: Update Pipeline IDs

Edit `api/ghl-client.ts` and find lines 83-84:

**Before:**
```typescript
pipelineId: 'job-request-management', // Update with actual pipeline ID
pipelineStageId: 'new-request', // Update with actual stage ID
```

**After (with your actual IDs):**
```typescript
pipelineId: 'YOUR_ACTUAL_PIPELINE_ID', // e.g., 'abc123xyz'
pipelineStageId: 'YOUR_ACTUAL_STAGE_ID', // e.g., 'def456uvw'
```

**How to find these:**
1. Go to GoHighLevel → Settings → Pipelines
2. Open your "Job Request Management" pipeline (or whatever you named it)
3. The URL will contain the Pipeline ID
4. Click on the first stage ("New Request") and the URL will contain the Stage ID

### Step 4: Test Locally

```bash
# Start the development server
npm run dev

# Visit http://localhost:5173
# Try submitting a test ticket
```

### Step 5: Deploy to Vercel

When deploying to Vercel, add these environment variables in the Vercel dashboard:

**Settings → Environment Variables:**

| Variable | Value |
|----------|-------|
| `GHL_ACCESS_TOKEN` | Your full access token |
| `GHL_LOCATION_ID` | Your location ID |
| `GHL_API_URL` | `https://services.leadconnectorhq.com` |

**Select:** Production, Preview, Development (all three)

## 🎯 What Changed

| Before (OAuth) | After (Access Token) |
|---------------|---------------------|
| Need Client ID | ❌ Not needed |
| Need Client Secret | ❌ Not needed |
| Complex auth flow | ✅ Simple token |
| Need Location ID | ✅ Still needed |

## 🔄 Token Rotation

**Important:** The Access Token you see shows a recommendation to rotate it every 90 days for security.

When you need to rotate:
1. Go to Private Integration → Click "Rotate and expire this token later"
2. Copy the NEW token
3. Update `.env.local` with the new token
4. Update Vercel environment variables with the new token
5. Redeploy

## ⚠️ Troubleshooting

### "GHL_ACCESS_TOKEN not configured"
- Make sure you copied the FULL token (not the one with asterisks)
- Check `.env.local` has no extra spaces or quotes
- Restart your dev server after changing `.env.local`

### "Failed to create ticket in GoHighLevel"
- Verify your Access Token is correct
- Check that Location ID is correct
- Make sure Pipeline IDs are updated in `api/ghl-client.ts`
- Look at console logs for detailed error messages

### Token is showing asterisks
- Click on the token field to reveal it
- Or click a "Show" or "Copy" button if available
- You need the full token starting with `pit-`

## ✅ You're Ready!

Once you have:
- ✅ Full Access Token in `.env.local`
- ✅ Location ID in `.env.local`
- ✅ Pipeline IDs updated in code

Run `npm run dev` and test it out!

---

**Need help?** The token should be visible in your Private Integration settings. If you're having trouble finding the full token (without asterisks), there should be a button to reveal or copy it.
