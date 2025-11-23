# PFC Ticketing System

A complete job request management system for PFC Security Services that integrates with GoHighLevel CRM.

## 🎯 Overview

This web application streamlines PFC's job request workflow by:
- Providing a mobile-friendly form for field managers to submit requests
- Automatically creating tickets in GoHighLevel
- Offering executives a real-time dashboard for monitoring all requests
- Enabling department managers to track assigned tasks
- Using GoHighLevel as the single source of truth

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Backend**: Vercel Serverless Functions
- **Data Storage**: GoHighLevel API
- **Deployment**: Vercel

## 📋 Features

### ✅ Ticket Intake Form (`/submit`)
- Mobile-optimized with 44px minimum touch targets
- Real-time validation
- Auto-save to localStorage every 30 seconds
- Progress indicator
- Conditional fields based on department selection
- Success confirmation with ticket number

### ✅ Executive Dashboard (`/dashboard`)
- Real-time summary statistics
- Sortable, searchable ticket table
- Filters by department, status, and priority
- Auto-refresh every 30 seconds
- CSV export functionality
- Responsive design (table on desktop, cards on mobile)

### ✅ Backend API
- `POST /api/tickets/create` - Create new ticket
- `GET /api/tickets/list` - List all tickets with filters
- `GET /api/tickets/[id]` - Get single ticket
- `PUT /api/tickets/update` - Update ticket

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- GoHighLevel account with API access
- Vercel account (for deployment)

### 1. Clone and Install

```bash
git clone <repository-url>
cd pfc-ticketing
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your GoHighLevel credentials:

```env
VITE_API_URL=/api
GHL_CLIENT_ID=your_ghl_client_id
GHL_CLIENT_SECRET=your_ghl_client_secret
GHL_LOCATION_ID=your_ghl_location_id
GHL_API_URL=https://services.leadconnectorhq.com
```

**Where to find these values:**
- Log in to your GoHighLevel account
- Go to Settings > Integrations > API
- Create a new OAuth application or use existing credentials
- Copy the Client ID, Client Secret, and Location ID

### 3. Set Up GoHighLevel Pipeline

Before running the app, create the pipeline in GoHighLevel:

1. Go to Settings > Pipelines
2. Create a new pipeline named "Job Request Management"
3. Add these stages:
   - New Request
   - Under Review
   - In Progress
   - Pending Info
   - Completed
   - Cancelled
4. Note the Pipeline ID and Stage IDs (update in `api/ghl-client.ts` if needed)

### 4. Create Custom Fields in GoHighLevel

Create these custom fields in your GoHighLevel location:

- `ticket_number` (Text)
- `client_name` (Text)
- `client_contact` (Text)
- `client_email` (Email)
- `client_phone` (Phone)
- `job_type` (Dropdown: Event Staffing, ESOC Assessment, Driver Detail, Operational Support, Emergency Response, Other)
- `job_description` (Text Area)
- `ticket_priority` (Dropdown: Low, Normal, High, Urgent)
- `event_date` (Date)
- `event_location` (Text)
- `requires_staffing` (Checkbox)
- `requires_logistics` (Checkbox)
- `requires_finance` (Checkbox)
- `requires_scheduling` (Checkbox)
- `personnel_count` (Number)
- `personnel_type` (Text)
- `budget_amount` (Currency)
- `billing_type` (Dropdown: Hourly, Fixed, Per Person, Per Event)
- `special_instructions` (Text Area)
- `ticket_status` (Text)
- `submitted_date` (Date/Time)

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📦 Deployment to Vercel

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### Option 2: Deploy via GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect the Vite framework
6. Add environment variables in the Vercel dashboard:
   - `GHL_CLIENT_ID`
   - `GHL_CLIENT_SECRET`
   - `GHL_LOCATION_ID`
   - `GHL_API_URL`
7. Click "Deploy"

### Setting Environment Variables in Vercel

1. Go to your project in Vercel dashboard
2. Click "Settings" > "Environment Variables"
3. Add each variable:
   - Key: `GHL_CLIENT_ID`
   - Value: Your actual client ID
   - Environment: Production, Preview, Development (check all)
4. Repeat for all environment variables
5. Redeploy if necessary

## 🏗️ Project Structure

```
pfc-ticketing/
├── api/                          # Vercel serverless functions
│   ├── ghl-client.ts            # GoHighLevel API client
│   └── tickets/
│       ├── create.ts            # POST /api/tickets/create
│       ├── list.ts              # GET /api/tickets/list
│       ├── [id].ts              # GET /api/tickets/:id
│       └── update.ts            # PUT /api/tickets/update
├── src/
│   ├── components/              # React components
│   │   ├── Layout.tsx           # App shell with navigation
│   │   ├── TicketForm.tsx       # Intake form
│   │   ├── TicketTable.tsx      # Sortable table
│   │   └── SummaryCard.tsx      # Metric cards
│   ├── pages/
│   │   ├── Dashboard.tsx        # Executive dashboard
│   │   └── Submit.tsx           # Ticket submission page
│   ├── services/
│   │   └── api.ts               # Frontend API client
│   ├── types/
│   │   └── ticket.ts            # TypeScript interfaces
│   ├── App.tsx                  # Main app with routing
│   ├── main.tsx                 # Entry point
│   └── index.css                # Tailwind CSS
├── .env.example                 # Environment variables template
├── .env.local                   # Local environment variables (gitignored)
├── vercel.json                  # Vercel configuration
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

## 🔧 Configuration

### Tailwind Custom Colors

The following custom colors are defined in `tailwind.config.js`:

- `primary`: #2563eb (Blue)
- `success`: #16a34a (Green)
- `warning`: #f59e0b (Amber)
- `error`: #dc2626 (Red)

Use them in your components: `bg-primary`, `text-success`, etc.

### API Endpoints

All API endpoints are serverless functions deployed to Vercel:

- **POST** `/api/tickets/create` - Create ticket
  - Body: `CreateTicketRequest` object
  - Returns: `{ success, ticketNumber, ticketId }`

- **GET** `/api/tickets/list` - List tickets
  - Query params: `department`, `status`, `priority`
  - Returns: `{ success, data: Ticket[] }`

- **GET** `/api/tickets/:id` - Get single ticket
  - Returns: `{ success, data: Ticket }`

- **PUT** `/api/tickets/update?id=:id` - Update ticket
  - Body: Partial ticket data
  - Returns: `{ success, data: Ticket }`

## 🧪 Testing

### Manual Testing Checklist

- [ ] Form validates required fields
- [ ] Form submits successfully
- [ ] Ticket appears in GoHighLevel
- [ ] Dashboard loads tickets
- [ ] Filters work correctly
- [ ] Search finds tickets
- [ ] Export CSV downloads
- [ ] Mobile form works (test on actual device)
- [ ] Auto-save recovers draft
- [ ] Conditional fields show/hide correctly

### Test on Mobile

1. Deploy to Vercel
2. Open on your phone: `https://your-app.vercel.app/submit`
3. Fill out the form
4. Submit and verify success
5. Check GoHighLevel for the ticket

## 🐛 Troubleshooting

### "CORS error when calling API"
- Check that `vercel.json` has correct CORS headers
- Ensure you're using `/api/*` paths, not full URLs

### "GHL authentication failed"
- Verify environment variables are set correctly in Vercel
- Check that CLIENT_ID, CLIENT_SECRET, and LOCATION_ID are correct
- Ensure your GoHighLevel OAuth app has correct permissions

### "Ticket not appearing in GHL"
- Verify pipeline name is exactly "Job Request Management"
- Check that custom fields are created in GoHighLevel
- Look at Vercel logs for API errors

### "Form not responsive on mobile"
- Test on actual device, not just browser resize
- Check that all inputs have proper Tailwind classes
- Verify minimum touch target size (44px)

### Build Errors
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## 📊 Data Flow

```
User fills form → Submit page → Frontend API service
                                        ↓
                                 Vercel serverless function
                                        ↓
                                 GoHighLevel API
                                        ↓
                                 Opportunity created
                                        ↓
                                 Success response
                                        ↓
                                 Dashboard refreshes
```

## 🔐 Security Notes

- Environment variables are never exposed to the frontend
- GoHighLevel credentials are only used in serverless functions
- `.env.local` is gitignored to prevent credential leaks
- API endpoints should be rate-limited in production
- Consider adding authentication for the frontend

## 📝 Maintenance

### Updating Ticket Fields

1. Add the field to `src/types/ticket.ts`
2. Add the field to the form in `src/components/TicketForm.tsx`
3. Update the API mapping in `api/ghl-client.ts`
4. Create the custom field in GoHighLevel
5. Deploy the changes

### Adding New Features

1. Create components in `src/components/`
2. Add pages in `src/pages/`
3. Update routing in `src/App.tsx`
4. Add API endpoints in `api/` if needed
5. Update types in `src/types/`

## 🤝 Contributing

This is a custom internal system for PFC. For questions or issues:
- Contact the development team
- Check the troubleshooting section
- Review GoHighLevel documentation

## 📄 License

Proprietary - PFC Security Services

---

**Built with ❤️ for PFC Security Services**
