# EdTech Events Calendar V16 - With Railway Backend

A beautiful, collaborative calendar application for tracking EdTech conferences, hyperscaler events, and AI-related workshops. Now with full backend support powered by Railway!

![Calendar Preview](https://img.shields.io/badge/Version-16-blue) ![Backend](https://img.shields.io/badge/Backend-Railway-purple) ![Database](https://img.shields.io/badge/Database-PostgreSQL-blue)

## ✨ Features

### 📅 Calendar Management
- Interactive monthly calendar view
- Event filtering by type, organization, and technology
- Priority-based event categorization
- Comprehensive event details and descriptions
- Add custom events

### 👥 Collaboration
- Multi-user attendance tracking
- Event registration system
- Interest markers
- Discussion threads on events
- Real-time colleague activity feed
- Collaborative notes

### 🚀 Backend Infrastructure
- RESTful API with Express.js
- PostgreSQL database
- Automatic deployment to Railway
- HTTPS/SSL included
- Auto-scaling
- Real-time monitoring

### 🎨 Modern UI
- Beautiful gradient design
- Responsive layout
- Interactive modals
- Real-time updates
- Mobile-friendly

## 🚀 Quick Deploy to Railway

**Deploy in 5 minutes!**

1. Push code to GitHub
2. Go to [railway.app](https://railway.app) and sign in
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add PostgreSQL database
6. Generate domain
7. Done! 🎉

[See detailed instructions →](./QUICK-START.md)

## 💻 Local Development

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- PostgreSQL (optional - can use Railway's database)

### Setup

**Windows:**
```bash
setup.bat
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**Manual Setup:**
```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database URL
# Or use Railway's database: railway link && railway run npm run dev

# Start development server
npm run dev
```

The server will start on `http://localhost:3000`

## 📁 Project Structure

```
calendar-v16/
├── index.html          # Main HTML file
├── styles.css          # Styling
├── script.js           # Frontend JavaScript
├── api.js             # API integration layer
├── server.js          # Express backend server
├── package.json       # Node.js dependencies
├── railway.json       # Railway configuration
├── Procfile          # Process file for Railway
├── test-api.html     # API testing utility
├── setup.sh          # Setup script (Mac/Linux)
├── setup.bat         # Setup script (Windows)
└── README.md         # This file

Documentation:
├── QUICK-START.md        # 5-minute deployment guide
├── DEPLOYMENT-GUIDE.md   # Detailed deployment instructions
├── FEATURES.md           # Complete features list
└── README-RAILWAY.md     # Railway-specific documentation
```

## 🔌 API Documentation

### Base URL
```
Production: https://your-app.railway.app/api
Local: http://localhost:3000/api
```

### Endpoints

#### Health Check
```http
GET /api/health
```

#### Colleagues
```http
GET    /api/colleagues
POST   /api/colleagues
DELETE /api/colleagues/:id
```

#### Events
```http
GET  /api/events
POST /api/events
```

#### Attendance
```http
GET    /api/attendance/:eventId
POST   /api/attendance
DELETE /api/attendance/:eventId/:userId
```

#### Interests
```http
GET    /api/interests/:eventId
POST   /api/interests
DELETE /api/interests/:eventId/:userId
```

#### Registrations
```http
GET    /api/registrations/:eventId
POST   /api/registrations
DELETE /api/registrations/:eventId/:userId
```

#### Notes
```http
GET    /api/notes/:eventId
POST   /api/notes
PUT    /api/notes/:id
DELETE /api/notes/:id
```

#### Collaboration Log
```http
GET  /api/collaboration-log
POST /api/collaboration-log
```

[See full API documentation →](./README-RAILWAY.md)

## 🧪 Testing

Open `test-api.html` in your browser to test all API endpoints interactively.

```bash
# Open test page
open test-api.html  # Mac
start test-api.html # Windows
```

## 🗄️ Database Schema

The backend automatically creates these tables:
- `colleagues` - User profiles
- `events` - Calendar events
- `attendance` - Event attendance
- `interests` - User interests
- `event_registrations` - Event sign-ups
- `notes` - Discussion threads
- `collaboration_log` - Activity history

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
PORT=3000
DATABASE_URL=postgresql://username:password@hostname:5432/database
```

Railway automatically provides these variables.

### Frontend API Configuration

Edit `api.js` to change the API URL:

```javascript
const API_BASE_URL = 'https://your-app.railway.app/api';
```

## 📊 Monitoring

### Railway Dashboard
- Real-time logs
- Performance metrics
- Database statistics
- Deployment history

### CLI Monitoring
```bash
# Install Railway CLI
npm i -g @railway/cli

# View logs
railway logs

# Check status
railway status
```

## 💰 Cost

**Railway Hobby Plan**: $5/month
- Includes $5 usage credit
- ~500 hours runtime
- 100GB bandwidth
- PostgreSQL database included

**Estimated cost for this app**: $2-3/month

## 🔒 Security

- HTTPS/SSL encryption
- Environment variables for secrets
- SQL injection prevention
- CORS protection
- Input validation

## 📚 Documentation

- [Quick Start Guide](./QUICK-START.md) - Deploy in 5 minutes
- [Deployment Guide](./DEPLOYMENT-GUIDE.md) - Detailed instructions
- [Features Documentation](./FEATURES.md) - Complete feature list
- [Railway Documentation](./README-RAILWAY.md) - Railway-specific docs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

MIT License - feel free to use this project however you'd like!

## 🎓 Educational Use

Perfect for learning:
- Full-stack web development
- RESTful API design
- Database design
- Cloud deployment
- DevOps practices
- Modern JavaScript

## 🆘 Support

### Documentation
- Check the docs in this repository
- Read Railway's [official documentation](https://docs.railway.app)

### Community
- [Railway Discord](https://discord.gg/railway)
- [GitHub Issues](https://github.com/railwayapp/railway/issues)

### Common Issues

**Can't connect to database?**
- Make sure PostgreSQL service is running in Railway
- Check DATABASE_URL environment variable

**API not responding?**
- Verify the service is deployed and running
- Check Railway logs for errors
- Test with `test-api.html`

**Local development issues?**
- Run `railway link` to connect to Railway project
- Use `railway run npm run dev` to use Railway's database

## 🌟 Highlights

✅ **Production-Ready**: Full backend with database  
✅ **Zero Configuration**: Automatic deployment  
✅ **Scalable**: Auto-scaling with Railway  
✅ **Secure**: HTTPS, SSL, environment variables  
✅ **Collaborative**: Multi-user support  
✅ **Modern**: Latest web technologies  
✅ **Well-Documented**: Comprehensive guides  
✅ **Cost-Effective**: ~$2-3/month to run  

## 🚀 Next Steps

1. ✅ Deploy to Railway (5 minutes)
2. 📝 Test all features
3. 👥 Share with colleagues
4. 🎨 Customize the design
5. 🔧 Add your own features
6. 📊 Monitor usage

## 📧 Contact

Have questions or suggestions? Open an issue on GitHub!

---

**Built with ❤️ for the EdTech community**

Deploy to Railway → [railway.app](https://railway.app)


