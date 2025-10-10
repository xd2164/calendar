# Railway Deployment Guide - Step by Step

## Quick Start (5 minutes)

### Step 1: Prepare Your Code
```bash
# Make sure all files are committed
git add .
git commit -m "Add Railway backend support"
git push origin main
```

### Step 2: Deploy to Railway

1. **Go to Railway**: https://railway.app
2. **Sign up/Login** with GitHub
3. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will auto-detect Node.js and deploy!

4. **Add Database**:
   - Click "New" in your project
   - Select "Database" → "PostgreSQL"
   - Done! Railway automatically links it

5. **Generate Domain**:
   - Go to your service settings
   - Click "Generate Domain"
   - Copy your URL: `https://your-app-name.railway.app`

### Step 3: Update Frontend (Optional)
If you want to use a custom domain or the Railway URL is different, update `index.html`:

```html
<!-- Add before closing </body> tag -->
<script src="api.js"></script>
```

That's it! Your calendar is now live with a full backend! 🎉

## What Railway Does Automatically

✅ Detects Node.js from `package.json`  
✅ Installs dependencies (`npm install`)  
✅ Creates PostgreSQL database  
✅ Sets environment variables (`DATABASE_URL`, `PORT`)  
✅ Builds and deploys your app  
✅ Provides HTTPS domain  
✅ Auto-restarts on crashes  
✅ Monitors your app  

## Testing Your Deployment

### Test the API
```bash
# Health check
curl https://your-app.railway.app/api/health

# Get events
curl https://your-app.railway.app/api/events
```

### Test the Frontend
Open your browser to:
```
https://your-app.railway.app
```

## Environment Variables

Railway automatically provides:
- `PORT` - Port number (don't hardcode this)
- `DATABASE_URL` - PostgreSQL connection string

No manual configuration needed!

## Costs

**Hobby Plan**: $5/month
- Includes $5 of usage
- ~500 hours of runtime
- Unlimited projects
- 100GB bandwidth
- Perfect for this calendar app

**Typical usage for this app**: ~$2-3/month

## Local Development with Railway Database

Want to use the same database locally?

```bash
# Install Railway CLI
npm i -g @railway/cli

# Link to your project
railway link

# Run locally with Railway environment
railway run npm run dev
```

## Updating Your App

Just push to GitHub:
```bash
git add .
git commit -m "Update calendar"
git push
```

Railway automatically redeploys! 🚀

## Common Issues & Solutions

### "Cannot connect to database"
- **Solution**: Make sure PostgreSQL service is running in Railway
- Check: Project → PostgreSQL → Status should be "Active"

### "Port already in use" (local dev)
```bash
# Kill process on port 3000
npx kill-port 3000
```

### Frontend not loading
- Check railway.json exists
- Verify `express.static('.')` in server.js
- Make sure index.html is in root directory

### Database tables not created
- **Solution**: Restart your Railway service
- Go to: Project → Service → Three dots → Restart

## Advanced: Custom Domain

1. Go to your Railway service
2. Settings → Domains
3. Add your custom domain
4. Update DNS records (Railway provides instructions)
5. Done!

## Monitoring

Railway Dashboard shows:
- **Deployments**: Build & deploy history
- **Metrics**: CPU, Memory, Network usage
- **Logs**: Real-time application logs
- **Database**: Connection info, usage

Access logs:
```bash
# Via CLI
railway logs
```

## Need Help?

- 📚 [Railway Docs](https://docs.railway.app)
- 💬 [Railway Discord](https://discord.gg/railway)
- 🐛 [GitHub Issues](https://github.com/railwayapp/railway/issues)

## Architecture

```
┌─────────────────┐
│   Users         │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Railway CDN    │ (Static files: HTML, CSS, JS)
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Express API    │ (REST endpoints)
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  PostgreSQL DB  │ (Data storage)
└─────────────────┘
```

## Backup Your Database

```bash
# Connect to Railway database
railway connect postgres

# Backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

## Migration from localStorage to Backend

The `api.js` file automatically handles the switch:
- Detects if running on Railway or localhost
- Uses correct API endpoint
- Handles errors gracefully
- Falls back to local data if API unavailable

All your localStorage data stays local - the backend starts fresh!

## Next Steps

1. ✅ Deploy to Railway
2. ✅ Test all features
3. 📱 Share your URL with colleagues
4. 🎨 Customize your domain
5. 📊 Monitor usage in Railway dashboard

Enjoy your production-ready calendar! 🗓️


