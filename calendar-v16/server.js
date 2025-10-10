const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Initialize database tables
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS colleagues (
        id BIGINT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        registered_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id BIGINT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        date DATE NOT NULL,
        time VARCHAR(10),
        description TEXT,
        organization VARCHAR(255),
        website VARCHAR(500),
        type VARCHAR(50),
        priority VARCHAR(50),
        use_cases TEXT,
        technologies TEXT,
        relevance TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        event_id BIGINT NOT NULL,
        user_id BIGINT NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        timestamp TIMESTAMP DEFAULT NOW(),
        UNIQUE(event_id, user_id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS interests (
        id SERIAL PRIMARY KEY,
        event_id BIGINT NOT NULL,
        user_id BIGINT NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        timestamp TIMESTAMP DEFAULT NOW(),
        UNIQUE(event_id, user_id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS event_registrations (
        id SERIAL PRIMARY KEY,
        event_id BIGINT NOT NULL,
        user_id BIGINT NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        timestamp TIMESTAMP DEFAULT NOW(),
        UNIQUE(event_id, user_id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id BIGINT PRIMARY KEY,
        event_id BIGINT NOT NULL,
        author VARCHAR(255) NOT NULL,
        title VARCHAR(500),
        content TEXT NOT NULL,
        note_type VARCHAR(50) DEFAULT 'general',
        timestamp TIMESTAMP DEFAULT NOW(),
        edited BOOLEAN DEFAULT FALSE,
        last_edited TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS collaboration_log (
        id BIGINT PRIMARY KEY,
        action VARCHAR(100) NOT NULL,
        colleague VARCHAR(255) NOT NULL,
        details TEXT,
        timestamp TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Initialize DB on startup
initDatabase();

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Calendar API is running' });
});

// Colleagues endpoints
app.get('/api/colleagues', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM colleagues ORDER BY registered_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching colleagues:', error);
    res.status(500).json({ error: 'Failed to fetch colleagues' });
  }
});

app.post('/api/colleagues', async (req, res) => {
  try {
    const { id, name, registeredAt } = req.body;
    const result = await pool.query(
      'INSERT INTO colleagues (id, name, registered_at) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET name = $2 RETURNING *',
      [id, name, registeredAt || new Date()]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding colleague:', error);
    res.status(500).json({ error: 'Failed to add colleague' });
  }
});

app.delete('/api/colleagues/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM colleagues WHERE id = $1', [id]);
    // Also remove from all attendance, interests, and registrations
    await pool.query('DELETE FROM attendance WHERE user_id = $1', [id]);
    await pool.query('DELETE FROM interests WHERE user_id = $1', [id]);
    await pool.query('DELETE FROM event_registrations WHERE user_id = $1', [id]);
    res.json({ message: 'Colleague removed successfully' });
  } catch (error) {
    console.error('Error removing colleague:', error);
    res.status(500).json({ error: 'Failed to remove colleague' });
  }
});

// Events endpoints
app.get('/api/events', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY date ASC');
    // Parse JSON fields
    const events = result.rows.map(event => ({
      ...event,
      useCases: event.use_cases ? JSON.parse(event.use_cases) : [],
      technologies: event.technologies ? JSON.parse(event.technologies) : []
    }));
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const { id, title, date, time, description, organization, website, type, priority, useCases, technologies, relevance } = req.body;
    const result = await pool.query(
      `INSERT INTO events (id, title, date, time, description, organization, website, type, priority, use_cases, technologies, relevance) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
       ON CONFLICT (id) DO UPDATE SET 
       title = $2, date = $3, time = $4, description = $5, organization = $6, 
       website = $7, type = $8, priority = $9, use_cases = $10, technologies = $11, relevance = $12
       RETURNING *`,
      [id, title, date, time, description, organization, website, type, priority, 
       JSON.stringify(useCases || []), JSON.stringify(technologies || []), relevance]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ error: 'Failed to add event' });
  }
});

// Attendance endpoints
app.get('/api/attendance/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const result = await pool.query(
      'SELECT user_id as id, user_name as name, timestamp FROM attendance WHERE event_id = $1 ORDER BY timestamp DESC',
      [eventId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

app.post('/api/attendance', async (req, res) => {
  try {
    const { eventId, userId, userName } = req.body;
    const result = await pool.query(
      'INSERT INTO attendance (event_id, user_id, user_name) VALUES ($1, $2, $3) ON CONFLICT (event_id, user_id) DO NOTHING RETURNING *',
      [eventId, userId, userName]
    );
    res.json(result.rows[0] || { message: 'Already exists' });
  } catch (error) {
    console.error('Error adding attendance:', error);
    res.status(500).json({ error: 'Failed to add attendance' });
  }
});

app.delete('/api/attendance/:eventId/:userId', async (req, res) => {
  try {
    const { eventId, userId } = req.params;
    await pool.query('DELETE FROM attendance WHERE event_id = $1 AND user_id = $2', [eventId, userId]);
    res.json({ message: 'Attendance removed' });
  } catch (error) {
    console.error('Error removing attendance:', error);
    res.status(500).json({ error: 'Failed to remove attendance' });
  }
});

// Interests endpoints
app.get('/api/interests/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const result = await pool.query(
      'SELECT user_id as id, user_name as name, timestamp FROM interests WHERE event_id = $1 ORDER BY timestamp DESC',
      [eventId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching interests:', error);
    res.status(500).json({ error: 'Failed to fetch interests' });
  }
});

app.post('/api/interests', async (req, res) => {
  try {
    const { eventId, userId, userName } = req.body;
    const result = await pool.query(
      'INSERT INTO interests (event_id, user_id, user_name) VALUES ($1, $2, $3) ON CONFLICT (event_id, user_id) DO NOTHING RETURNING *',
      [eventId, userId, userName]
    );
    res.json(result.rows[0] || { message: 'Already exists' });
  } catch (error) {
    console.error('Error adding interest:', error);
    res.status(500).json({ error: 'Failed to add interest' });
  }
});

app.delete('/api/interests/:eventId/:userId', async (req, res) => {
  try {
    const { eventId, userId } = req.params;
    await pool.query('DELETE FROM interests WHERE event_id = $1 AND user_id = $2', [eventId, userId]);
    res.json({ message: 'Interest removed' });
  } catch (error) {
    console.error('Error removing interest:', error);
    res.status(500).json({ error: 'Failed to remove interest' });
  }
});

// Event registrations endpoints
app.get('/api/registrations/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const result = await pool.query(
      'SELECT user_id as id, user_name as name, timestamp FROM event_registrations WHERE event_id = $1 ORDER BY timestamp DESC',
      [eventId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

app.post('/api/registrations', async (req, res) => {
  try {
    const { eventId, userId, userName } = req.body;
    const result = await pool.query(
      'INSERT INTO event_registrations (event_id, user_id, user_name) VALUES ($1, $2, $3) ON CONFLICT (event_id, user_id) DO NOTHING RETURNING *',
      [eventId, userId, userName]
    );
    res.json(result.rows[0] || { message: 'Already exists' });
  } catch (error) {
    console.error('Error adding registration:', error);
    res.status(500).json({ error: 'Failed to add registration' });
  }
});

app.delete('/api/registrations/:eventId/:userId', async (req, res) => {
  try {
    const { eventId, userId } = req.params;
    await pool.query('DELETE FROM event_registrations WHERE event_id = $1 AND user_id = $2', [eventId, userId]);
    res.json({ message: 'Registration removed' });
  } catch (error) {
    console.error('Error removing registration:', error);
    res.status(500).json({ error: 'Failed to remove registration' });
  }
});

// Notes endpoints
app.get('/api/notes/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const result = await pool.query(
      'SELECT id, author, title, content, note_type as type, timestamp, edited, last_edited as "lastEdited" FROM notes WHERE event_id = $1 ORDER BY timestamp DESC',
      [eventId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

app.post('/api/notes', async (req, res) => {
  try {
    const { id, eventId, author, title, content, type } = req.body;
    const result = await pool.query(
      'INSERT INTO notes (id, event_id, author, title, content, note_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id, eventId, author, title, content, type || 'general']
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ error: 'Failed to add note' });
  }
});

app.put('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const result = await pool.query(
      'UPDATE notes SET content = $1, edited = true, last_edited = NOW() WHERE id = $2 RETURNING *',
      [content, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM notes WHERE id = $1', [id]);
    res.json({ message: 'Note deleted' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// Collaboration log endpoints
app.get('/api/collaboration-log', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM collaboration_log ORDER BY timestamp DESC LIMIT 50');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching collaboration log:', error);
    res.status(500).json({ error: 'Failed to fetch collaboration log' });
  }
});

app.post('/api/collaboration-log', async (req, res) => {
  try {
    const { id, action, colleague, details } = req.body;
    const result = await pool.query(
      'INSERT INTO collaboration_log (id, action, colleague, details) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, action, colleague, details]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding to collaboration log:', error);
    res.status(500).json({ error: 'Failed to add to collaboration log' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Health: http://localhost:${PORT}/api/health`);
});


