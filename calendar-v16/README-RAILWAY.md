# EdTech Events Calendar - Railway Backend Setup

This calendar application now includes a complete backend powered by Railway.

## Features

- **PostgreSQL Database**: Persistent storage for all calendar data
- **RESTful API**: Complete API for events, colleagues, attendance, and notes
- **Easy Deployment**: One-click deployment to Railway
- **Auto-scaling**: Railway handles scaling automatically

## Railway Deployment Instructions

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (recommended)

### Step 2: Deploy to Railway

#### Option A: Deploy from GitHub (Recommended)
1. Push this code to a GitHub repository
2. Go to Railway Dashboard
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Select your repository
6. Railway will automatically detect the Node.js app

#### Option B: Deploy with Railway CLI
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

### Step 3: Add PostgreSQL Database
1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create a database and set the `DATABASE_URL` environment variable

### Step 4: Configure Environment Variables
Railway automatically provides:
- `PORT` - The port your application will run on
- `DATABASE_URL` - PostgreSQL connection string

No manual configuration needed!

### Step 5: Access Your Application
1. Go to your Railway project settings
2. Click "Generate Domain" to get a public URL
3. Your API will be available at `https://your-app.railway.app`

## API Endpoints

### Health Check
- `GET /api/health` - Check if API is running

### Colleagues
- `GET /api/colleagues` - Get all colleagues
- `POST /api/colleagues` - Add a colleague
- `DELETE /api/colleagues/:id` - Remove a colleague

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Add/update an event

### Attendance
- `GET /api/attendance/:eventId` - Get attendance for an event
- `POST /api/attendance` - Mark attendance
- `DELETE /api/attendance/:eventId/:userId` - Remove attendance

### Interests
- `GET /api/interests/:eventId` - Get interests for an event
- `POST /api/interests` - Mark interest
- `DELETE /api/interests/:eventId/:userId` - Remove interest

### Event Registrations
- `GET /api/registrations/:eventId` - Get registrations for an event
- `POST /api/registrations` - Register for event
- `DELETE /api/registrations/:eventId/:userId` - Unregister from event

### Notes
- `GET /api/notes/:eventId` - Get notes for an event
- `POST /api/notes` - Add a note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

### Collaboration Log
- `GET /api/collaboration-log` - Get recent collaboration activity
- `POST /api/collaboration-log` - Add to collaboration log

## Local Development

### Prerequisites
- Node.js 18 or higher
- PostgreSQL (optional - can use Railway's database for development)

### Setup
```bash
# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your database credentials
# Or use Railway's database URL

# Run development server
npm run dev
```

### Using Railway Database for Local Development
```bash
# Link to Railway project
railway link

# Run with Railway environment
railway run npm run dev
```

## Frontend Configuration

Update the `API_BASE_URL` in `script.js` to point to your Railway backend:

```javascript
const API_BASE_URL = 'https://your-app.railway.app/api';
```

For local development:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

## Database Schema

The backend automatically creates these tables:
- `colleagues` - User registrations
- `events` - Calendar events
- `attendance` - Event attendance tracking
- `interests` - User interests in events
- `event_registrations` - Event registrations
- `notes` - Discussion notes
- `collaboration_log` - Activity log

## Monitoring

Railway provides built-in monitoring:
- View logs in real-time
- Monitor CPU and memory usage
- Track deployment history
- Set up custom metrics

## Cost

Railway offers:
- **Hobby Plan**: $5/month with $5 usage credit (perfect for small projects)
- **Free Trial**: $5 credit to start
- PostgreSQL database included

## Support

For Railway support:
- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Railway GitHub](https://github.com/railwayapp)

## Troubleshooting

### Database Connection Issues
```bash
# Check if DATABASE_URL is set
railway variables

# Test database connection
railway run node -e "const {Pool} = require('pg'); const pool = new Pool({connectionString: process.env.DATABASE_URL}); pool.query('SELECT NOW()').then(console.log).catch(console.error)"
```

### Build Failures
- Ensure `package.json` has correct `engines` field
- Check Railway build logs for specific errors
- Verify all dependencies are in `package.json`

### Port Issues
- Railway automatically sets the `PORT` environment variable
- Don't hardcode port 3000 in production
- Use `process.env.PORT || 3000`


