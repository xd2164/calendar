#!/usr/bin/env python3
"""
Simple Calendar Backend Server - No external dependencies required!
Uses only Python standard library (http.server, sqlite3, json)
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import sqlite3
from datetime import datetime
from urllib.parse import urlparse, parse_qs
import os

# Database setup
DATABASE = 'calendar.db'

def get_db():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize database tables"""
    conn = get_db()
    cursor = conn.cursor()
    
    # Colleagues table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS colleagues (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Events table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT,
            description TEXT,
            organization TEXT,
            website TEXT,
            type TEXT,
            priority TEXT,
            use_cases TEXT,
            technologies TEXT,
            relevance TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Attendance table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            user_name TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(event_id, user_id)
        )
    ''')
    
    # Interests table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS interests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            user_name TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(event_id, user_id)
        )
    ''')
    
    # Event registrations table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS event_registrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            user_name TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(event_id, user_id)
        )
    ''')
    
    # Notes table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY,
            event_id INTEGER NOT NULL,
            author TEXT NOT NULL,
            title TEXT,
            content TEXT NOT NULL,
            note_type TEXT DEFAULT 'general',
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            edited INTEGER DEFAULT 0,
            last_edited TIMESTAMP
        )
    ''')
    
    # Collaboration log table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS collaboration_log (
            id INTEGER PRIMARY KEY,
            action TEXT NOT NULL,
            colleague TEXT NOT NULL,
            details TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()
    print('✅ Database initialized successfully')

def row_to_dict(row):
    """Convert sqlite3.Row to dictionary"""
    return dict(zip(row.keys(), row))

class CalendarAPIHandler(BaseHTTPRequestHandler):
    """HTTP Request Handler for Calendar API"""
    
    def _set_cors_headers(self):
        """Set CORS headers to allow frontend requests"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
    
    def _send_json_response(self, data, status_code=200):
        """Send JSON response"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self._set_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def _send_file(self, filepath):
        """Serve static files"""
        try:
            with open(filepath, 'rb') as f:
                content = f.read()
            
            self.send_response(200)
            if filepath.endswith('.html'):
                self.send_header('Content-Type', 'text/html')
            elif filepath.endswith('.css'):
                self.send_header('Content-Type', 'text/css')
            elif filepath.endswith('.js'):
                self.send_header('Content-Type', 'application/javascript')
            self.end_headers()
            self.wfile.write(content)
        except FileNotFoundError:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'File not found')
    
    def do_OPTIONS(self):
        """Handle preflight CORS requests"""
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()
    
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Serve static files
        if path == '/':
            self._send_file('index.html')
            return
        elif path.endswith('.html') or path.endswith('.css') or path.endswith('.js'):
            self._send_file(path.lstrip('/'))
            return
        
        # API endpoints
        try:
            if path == '/api/health':
                self._send_json_response({
                    'status': 'ok',
                    'message': 'Calendar API is running (Python Simple Server)',
                    'database': 'SQLite'
                })
            
            elif path == '/api/colleagues':
                conn = get_db()
                cursor = conn.cursor()
                cursor.execute('SELECT * FROM colleagues ORDER BY registered_at DESC')
                colleagues = [row_to_dict(row) for row in cursor.fetchall()]
                conn.close()
                self._send_json_response(colleagues)
            
            elif path == '/api/events':
                conn = get_db()
                cursor = conn.cursor()
                cursor.execute('SELECT * FROM events ORDER BY date ASC')
                events = []
                for row in cursor.fetchall():
                    event = row_to_dict(row)
                    event['useCases'] = json.loads(event['use_cases']) if event['use_cases'] else []
                    event['technologies'] = json.loads(event['technologies']) if event['technologies'] else []
                    events.append(event)
                conn.close()
                self._send_json_response(events)
            
            elif path.startswith('/api/attendance/'):
                event_id = int(path.split('/')[-1])
                conn = get_db()
                cursor = conn.cursor()
                cursor.execute('SELECT user_id as id, user_name as name, timestamp FROM attendance WHERE event_id = ? ORDER BY timestamp DESC', (event_id,))
                attendance = [row_to_dict(row) for row in cursor.fetchall()]
                conn.close()
                self._send_json_response(attendance)
            
            elif path.startswith('/api/interests/'):
                event_id = int(path.split('/')[-1])
                conn = get_db()
                cursor = conn.cursor()
                cursor.execute('SELECT user_id as id, user_name as name, timestamp FROM interests WHERE event_id = ? ORDER BY timestamp DESC', (event_id,))
                interests = [row_to_dict(row) for row in cursor.fetchall()]
                conn.close()
                self._send_json_response(interests)
            
            elif path.startswith('/api/registrations/'):
                event_id = int(path.split('/')[-1])
                conn = get_db()
                cursor = conn.cursor()
                cursor.execute('SELECT user_id as id, user_name as name, timestamp FROM event_registrations WHERE event_id = ? ORDER BY timestamp DESC', (event_id,))
                registrations = [row_to_dict(row) for row in cursor.fetchall()]
                conn.close()
                self._send_json_response(registrations)
            
            elif path.startswith('/api/notes/'):
                event_id = int(path.split('/')[-1])
                conn = get_db()
                cursor = conn.cursor()
                cursor.execute('SELECT id, author, title, content, note_type as type, timestamp, edited, last_edited as lastEdited FROM notes WHERE event_id = ? ORDER BY timestamp DESC', (event_id,))
                notes = [row_to_dict(row) for row in cursor.fetchall()]
                conn.close()
                self._send_json_response(notes)
            
            elif path == '/api/collaboration-log':
                conn = get_db()
                cursor = conn.cursor()
                cursor.execute('SELECT * FROM collaboration_log ORDER BY timestamp DESC LIMIT 50')
                logs = [row_to_dict(row) for row in cursor.fetchall()]
                conn.close()
                self._send_json_response(logs)
            
            else:
                self._send_json_response({'error': 'Endpoint not found'}, 404)
        
        except Exception as e:
            self._send_json_response({'error': str(e)}, 500)
    
    def do_POST(self):
        """Handle POST requests"""
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        
        try:
            data = json.loads(body) if body else {}
            path = self.path
            
            if path == '/api/colleagues':
                conn = get_db()
                cursor = conn.cursor()
                cursor.execute('INSERT OR REPLACE INTO colleagues (id, name, registered_at) VALUES (?, ?, ?)',
                             (data['id'], data['name'], data.get('registeredAt', datetime.now().isoformat())))
                conn.commit()
                cursor.execute('SELECT * FROM colleagues WHERE id = ?', (data['id'],))
                colleague = row_to_dict(cursor.fetchone())
                conn.close()
                self._send_json_response(colleague)
            
            elif path == '/api/events':
                conn = get_db()
                cursor = conn.cursor()
                cursor.execute('''INSERT OR REPLACE INTO events 
                    (id, title, date, time, description, organization, website, type, priority, use_cases, technologies, relevance)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                    (data['id'], data['title'], data['date'], data.get('time'), data.get('description'),
                     data.get('organization'), data.get('website'), data.get('type'), data.get('priority'),
                     json.dumps(data.get('useCases', [])), json.dumps(data.get('technologies', [])), data.get('relevance')))
                conn.commit()
                cursor.execute('SELECT * FROM events WHERE id = ?', (data['id'],))
                event = row_to_dict(cursor.fetchone())
                conn.close()
                self._send_json_response(event)
            
            elif path == '/api/attendance':
                conn = get_db()
                cursor = conn.cursor()
                try:
                    cursor.execute('INSERT INTO attendance (event_id, user_id, user_name) VALUES (?, ?, ?)',
                                 (data['eventId'], data['userId'], data['userName']))
                    conn.commit()
                    message = {'message': 'Attendance added'}
                except sqlite3.IntegrityError:
                    message = {'message': 'Already exists'}
                conn.close()
                self._send_json_response(message)
            
            elif path == '/api/interests':
                conn = get_db()
                cursor = conn.cursor()
                try:
                    cursor.execute('INSERT INTO interests (event_id, user_id, user_name) VALUES (?, ?, ?)',
                                 (data['eventId'], data['userId'], data['userName']))
                    conn.commit()
                    message = {'message': 'Interest added'}
                except sqlite3.IntegrityError:
                    message = {'message': 'Already exists'}
                conn.close()
                self._send_json_response(message)
            
            elif path == '/api/registrations':
                conn = get_db()
                cursor = conn.cursor()
                try:
                    cursor.execute('INSERT INTO event_registrations (event_id, user_id, user_name) VALUES (?, ?, ?)',
                                 (data['eventId'], data['userId'], data['userName']))
                    conn.commit()
                    message = {'message': 'Registration added'}
                except sqlite3.IntegrityError:
                    message = {'message': 'Already exists'}
                conn.close()
                self._send_json_response(message)
            
            elif path == '/api/notes':
                conn = get_db()
                cursor = conn.cursor()
                cursor.execute('INSERT INTO notes (id, event_id, author, title, content, note_type) VALUES (?, ?, ?, ?, ?, ?)',
                             (data['id'], data['eventId'], data['author'], data.get('title'), data['content'], data.get('type', 'general')))
                conn.commit()
                cursor.execute('SELECT * FROM notes WHERE id = ?', (data['id'],))
                note = row_to_dict(cursor.fetchone())
                conn.close()
                self._send_json_response(note)
            
            elif path == '/api/collaboration-log':
                conn = get_db()
                cursor = conn.cursor()
                cursor.execute('INSERT INTO collaboration_log (id, action, colleague, details) VALUES (?, ?, ?, ?)',
                             (data['id'], data['action'], data['colleague'], data.get('details')))
                conn.commit()
                cursor.execute('SELECT * FROM collaboration_log WHERE id = ?', (data['id'],))
                log = row_to_dict(cursor.fetchone())
                conn.close()
                self._send_json_response(log)
            
            else:
                self._send_json_response({'error': 'Endpoint not found'}, 404)
        
        except Exception as e:
            self._send_json_response({'error': str(e)}, 500)
    
    def do_DELETE(self):
        """Handle DELETE requests"""
        try:
            path = self.path
            parts = path.split('/')
            
            if '/api/colleagues/' in path:
                colleague_id = int(parts[-1])
                conn = get_db()
                cursor = conn.cursor()
                cursor.execute('DELETE FROM colleagues WHERE id = ?', (colleague_id,))
                cursor.execute('DELETE FROM attendance WHERE user_id = ?', (colleague_id,))
                cursor.execute('DELETE FROM interests WHERE user_id = ?', (colleague_id,))
                cursor.execute('DELETE FROM event_registrations WHERE user_id = ?', (colleague_id,))
                conn.commit()
                conn.close()
                self._send_json_response({'message': 'Colleague removed'})
            
            elif '/api/attendance/' in path:
                event_id, user_id = int(parts[-2]), int(parts[-1])
                conn = get_db()
                cursor = conn.cursor()
                cursor.execute('DELETE FROM attendance WHERE event_id = ? AND user_id = ?', (event_id, user_id))
                conn.commit()
                conn.close()
                self._send_json_response({'message': 'Attendance removed'})
            
            elif '/api/interests/' in path:
                event_id, user_id = int(parts[-2]), int(parts[-1])
                conn = get_db()
                cursor = conn.cursor()
                cursor.execute('DELETE FROM interests WHERE event_id = ? AND user_id = ?', (event_id, user_id))
                conn.commit()
                conn.close()
                self._send_json_response({'message': 'Interest removed'})
            
            elif '/api/registrations/' in path:
                event_id, user_id = int(parts[-2]), int(parts[-1])
                conn = get_db()
                cursor = conn.cursor()
                cursor.execute('DELETE FROM event_registrations WHERE event_id = ? AND user_id = ?', (event_id, user_id))
                conn.commit()
                conn.close()
                self._send_json_response({'message': 'Registration removed'})
            
            elif '/api/notes/' in path:
                note_id = int(parts[-1])
                conn = get_db()
                cursor = conn.cursor()
                cursor.execute('DELETE FROM notes WHERE id = ?', (note_id,))
                conn.commit()
                conn.close()
                self._send_json_response({'message': 'Note deleted'})
            
            else:
                self._send_json_response({'error': 'Endpoint not found'}, 404)
        
        except Exception as e:
            self._send_json_response({'error': str(e)}, 500)
    
    def do_PUT(self):
        """Handle PUT requests"""
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        
        try:
            data = json.loads(body) if body else {}
            path = self.path
            
            if '/api/notes/' in path:
                note_id = int(path.split('/')[-1])
                conn = get_db()
                cursor = conn.cursor()
                cursor.execute('UPDATE notes SET content = ?, edited = 1, last_edited = ? WHERE id = ?',
                             (data['content'], datetime.now().isoformat(), note_id))
                conn.commit()
                cursor.execute('SELECT * FROM notes WHERE id = ?', (note_id,))
                note = row_to_dict(cursor.fetchone())
                conn.close()
                self._send_json_response(note)
            else:
                self._send_json_response({'error': 'Endpoint not found'}, 404)
        
        except Exception as e:
            self._send_json_response({'error': str(e)}, 500)
    
    def log_message(self, format, *args):
        """Custom log format"""
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {format % args}")

def run_server(port=3000):
    """Start the HTTP server"""
    init_db()
    
    server_address = ('', port)
    httpd = HTTPServer(server_address, CalendarAPIHandler)
    
    print(f'''
╔════════════════════════════════════════════╗
║  🎉 Calendar Backend Server Started!      ║
║                                            ║
║  🌐 Server: http://localhost:{port}       ║
║  🏥 Health: http://localhost:{port}/api/health
║  📄 Test:   http://localhost:{port}/test-api.html
║  📊 Database: SQLite (calendar.db)        ║
║                                            ║
║  ✅ No external packages required!        ║
║  Press CTRL+C to stop                      ║
╚════════════════════════════════════════════╝
    ''')
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\n\n🛑 Server stopped.')
        httpd.shutdown()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3000))
    run_server(port)

