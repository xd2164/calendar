const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// Initialize SQLite database
const db = new sqlite3.Database('./events.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        // Create events table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT,
            description TEXT,
            organization TEXT,
            website TEXT,
            type TEXT,
            priority TEXT,
            useCases TEXT,
            technologies TEXT,
            relevance TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// API Routes

// Get all events
app.get('/api/events', (req, res) => {
    db.all('SELECT * FROM events ORDER BY date ASC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        // Parse JSON fields
        const events = rows.map(row => ({
            ...row,
            useCases: row.useCases ? JSON.parse(row.useCases) : [],
            technologies: row.technologies ? JSON.parse(row.technologies) : []
        }));
        res.json(events);
    });
});

// Get event by ID
app.get('/api/events/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM events WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }
        // Parse JSON fields
        const event = {
            ...row,
            useCases: row.useCases ? JSON.parse(row.useCases) : [],
            technologies: row.technologies ? JSON.parse(row.technologies) : []
        };
        res.json(event);
    });
});

// Create new event
app.post('/api/events', (req, res) => {
    const { title, date, time, description, organization, website, type, priority, useCases, technologies, relevance } = req.body;
    
    const sql = `INSERT INTO events (title, date, time, description, organization, website, type, priority, useCases, technologies, relevance)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const params = [
        title, date, time || '', description, organization, website, type, priority,
        JSON.stringify(useCases || []), JSON.stringify(technologies || []), relevance || 'User-added event'
    ];
    
    db.run(sql, params, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ 
            id: this.lastID,
            message: 'Event created successfully',
            event: { id: this.lastID, title, date, time, description, organization, website, type, priority, useCases, technologies, relevance }
        });
    });
});

// Update event
app.put('/api/events/:id', (req, res) => {
    const id = req.params.id;
    const { title, date, time, description, organization, website, type, priority, useCases, technologies, relevance } = req.body;
    
    const sql = `UPDATE events SET title = ?, date = ?, time = ?, description = ?, organization = ?, 
                 website = ?, type = ?, priority = ?, useCases = ?, technologies = ?, relevance = ?
                 WHERE id = ?`;
    
    const params = [
        title, date, time || '', description, organization, website, type, priority,
        JSON.stringify(useCases || []), JSON.stringify(technologies || []), relevance || 'User-added event', id
    ];
    
    db.run(sql, params, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }
        res.json({ message: 'Event updated successfully' });
    });
});

// Delete event
app.delete('/api/events/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM events WHERE id = ?', [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }
        res.json({ message: 'Event deleted successfully' });
    });
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Calendar V17 Backend running on http://localhost:${PORT}`);
    console.log(`📅 API endpoints available at http://localhost:${PORT}/api/events`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Database connection closed.');
        process.exit(0);
    });
});
