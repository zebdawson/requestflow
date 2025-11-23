# 🚀 Quick Start Guide - PFC Ticketing System

## ✅ What's Been Built

Your complete ticketing system is ready! Here's what you have:

### Frontend Features
- ✅ **Mobile-optimized intake form** (`/submit`)
  - Real-time validation
  - Auto-save every 30 seconds
  - Conditional fields
  - Progress indicator

- ✅ **Executive dashboard** (`/dashboard`)
  - Real-time statistics
  - Filters & search
  - Auto-refresh every 30s
  - CSV export
  - Mobile responsive

### Backend Features
- ✅ **4 Vercel serverless API endpoints**
  - Create tickets
  - List tickets with filters
  - Get single ticket
  - Update tickets

### Integration
- ✅ **GoHighLevel ready**
  - All API calls configured
  - Custom field mapping
  - OAuth2 authentication

## 🎯 Next Steps

### 1. Set Up GoHighLevel (5 minutes)

**Create Pipeline:**
1. Log in to GoHighLevel
2. Go to Settings > Pipelines
3. Create pipeline: "Job Request Management"
4. Add stages: New Request, Under Review, In Progress, Pending Info, Completed, Cancelled
5. **Note the Pipeline ID and Stage IDs**

**Create Custom Fields:**
Copy these field names exactly:
```
ticket_number (Text)
client_name (Text)
client_contact (Text)
client_email (Email)
client_phone (Phone)
job_type (Dropdown)
job_description (Text Area)
ticket_priority (Dropdown)
event_date (Date)
event_location (Text)
requires_staffing (Checkbox)
requires_logistics (Checkbox)
requires_finance (Checkbox)
requires_scheduling (Checkbox)
personnel_count (Number)
personnel_type (Text)
budget_amount (Currency)
billing_type (Dropdown)
special_instructions (Text Area)
ticket_status (Text)
submitted_date (Date/Time)
```

**Get API Credentials:**
1. Go to Settings > Integrations > API
2. Create OAuth app or use existing
3. Copy: Client ID, Client Secret, Location ID

### 2. Update Configuration (2 minutes)

**Edit `.env.local`:**
```env
GHL_CLIENT_ID=paste_your_client_id_here
GHL_CLIENT_SECRET=paste_your_client_secret_here
GHL_LOCATION_ID=paste_your_location_id_here
```

**Edit `api/ghl-client.ts`** (lines 78-79):
```typescript
pipelineId: 'YOUR_ACTUAL_PIPELINE_ID', // Replace this
pipelineStageId: 'YOUR_ACTUAL_STAGE_ID', // Replace this
```

### 3. Test Locally (5 minutes)

```bash
# Start development server
npm run dev

# Open in browser
# http://localhost:5173
```

**Test the flow:**
1. Go to `/submit`
2. Fill out form
3. Submit ticket
4. Check GoHighLevel for new opportunity
5. Go to `/dashboard`
6. Verify ticket appears
7. Test filters and search

### 4. Deploy to Vercel (10 minutes)

**Option A: GitHub Deploy (Recommended)**
```bash
# Already committed and pushed!
# Just go to vercel.com and import your repo
```

**Option B: Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel
```

**In Vercel Dashboard:**
1. Go to Settings > Environment Variables
2. Add these variables:
   - `GHL_CLIENT_ID` = your_client_id
   - `GHL_CLIENT_SECRET` = your_client_secret
   - `GHL_LOCATION_ID` = your_location_id
   - `GHL_API_URL` = https://services.leadconnectorhq.com
3. Select: Production, Preview, Development (all three)
4. Click Deploy

### 5. Test on Mobile (5 minutes)

1. Get your Vercel URL: `https://your-app.vercel.app`
2. Open on your phone
3. Submit a test ticket
4. Verify in GoHighLevel
5. Check dashboard

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```js
colors: {
  primary: '#YOUR_BLUE',
  success: '#YOUR_GREEN',
  warning: '#YOUR_YELLOW',
  error: '#YOUR_RED',
}
```

### Add Fields
1. Add to `src/types/ticket.ts`
2. Add to `src/components/TicketForm.tsx`
3. Update `api/ghl-client.ts` mapping
4. Create custom field in GoHighLevel
5. Rebuild and deploy

### Modify Job Types
Edit `src/types/ticket.ts`:
```typescript
export type JobType =
  | 'Your Custom Type'
  | 'Another Type'
  | 'Event Staffing'
  // ... add more
```

Then update the dropdown in `TicketForm.tsx`.

## 📱 User Guide

### For Field Managers
1. Go to `/submit`
2. Fill out all required fields (marked with *)
3. Select departments that need to be involved
4. Add optional details if needed
5. Click "Submit Ticket Request"
6. Save your ticket number!

### For Executives
1. Go to `/dashboard`
2. View summary cards at top
3. Use filters to narrow down tickets
4. Search for specific tickets
5. Click on any ticket to view details
6. Export to CSV for reporting

## 🐛 Common Issues

### "Cannot connect to GoHighLevel"
- Check environment variables are set correctly
- Verify CLIENT_ID, CLIENT_SECRET, LOCATION_ID
- Make sure OAuth app has correct permissions

### "Ticket not appearing"
- Verify pipeline name is exactly "Job Request Management"
- Check custom fields are created
- Look at Vercel logs for errors

### "Build fails"
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📊 File Structure

```
Key files you may need to edit:
- .env.local - Your credentials
- api/ghl-client.ts - GoHighLevel config
- src/components/TicketForm.tsx - Form fields
- src/types/ticket.ts - Data structure
- tailwind.config.js - Colors & styling
```

## 🔐 Security Checklist

- [ ] Environment variables in Vercel (not in code)
- [ ] `.env.local` is gitignored
- [ ] Test with real credentials
- [ ] Verify CORS headers work
- [ ] Test on actual mobile device

## 📞 Support

For questions or issues:
1. Check the main README.md
2. Review troubleshooting section
3. Check Vercel deployment logs
4. Verify GoHighLevel configuration

## 🎉 You're Done!

Your PFC Ticketing System is complete and ready to use!

**What you built:**
- Complete full-stack application
- Mobile-first responsive design
- Real-time GoHighLevel integration
- Production-ready code
- Comprehensive documentation

**Time to deploy:** ~30 minutes including GoHighLevel setup

---

Built with Claude Code 🚀
