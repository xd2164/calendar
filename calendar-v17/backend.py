#!/usr/bin/env python3
"""
Simple Python backend for EdTech Events Calendar V17
Uses SQLite database to persist events
"""

import sqlite3
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import os

class CalendarAPIHandler(BaseHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.db_path = 'events.db'
        self.init_database()
        super().__init__(*args, **kwargs)
    
    def init_database(self):
        """Initialize SQLite database with events table"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS events (
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
            )
        ''')
        conn.commit()
        conn.close()
    
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/events':
            self.get_events()
        elif parsed_path.path.startswith('/api/events/'):
            event_id = parsed_path.path.split('/')[-1]
            self.get_event(event_id)
        elif parsed_path.path == '/':
            self.serve_index()
        else:
            self.send_error(404, "Not Found")
    
    def do_POST(self):
        """Handle POST requests"""
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/events':
            self.create_event()
        else:
            self.send_error(404, "Not Found")
    
    def do_PUT(self):
        """Handle PUT requests"""
        parsed_path = urlparse(self.path)
        
        if parsed_path.path.startswith('/api/events/'):
            event_id = parsed_path.path.split('/')[-1]
            self.update_event(event_id)
        else:
            self.send_error(404, "Not Found")
    
    def do_DELETE(self):
        """Handle DELETE requests"""
        parsed_path = urlparse(self.path)
        
        if parsed_path.path.startswith('/api/events/'):
            event_id = parsed_path.path.split('/')[-1]
            self.delete_event(event_id)
        else:
            self.send_error(404, "Not Found")
    
    def get_events(self):
        """Get all events"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM events ORDER BY date ASC')
            rows = cursor.fetchall()
            conn.close()
            
            events = []
            for row in rows:
                event = {
                    'id': row[0],
                    'title': row[1],
                    'date': row[2],
                    'time': row[3] or '',
                    'description': row[4] or '',
                    'organization': row[5] or '',
                    'website': row[6] or '',
                    'type': row[7] or '',
                    'priority': row[8] or '',
                    'useCases': json.loads(row[9]) if row[9] else [],
                    'technologies': json.loads(row[10]) if row[10] else [],
                    'relevance': row[11] or ''
                }
                events.append(event)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(events).encode())
            
        except Exception as e:
            self.send_error(500, f"Database error: {str(e)}")
    
    def get_event(self, event_id):
        """Get single event by ID"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM events WHERE id = ?', (event_id,))
            row = cursor.fetchone()
            conn.close()
            
            if not row:
                self.send_error(404, "Event not found")
                return
            
            event = {
                'id': row[0],
                'title': row[1],
                'date': row[2],
                'time': row[3] or '',
                'description': row[4] or '',
                'organization': row[5] or '',
                'website': row[6] or '',
                'type': row[7] or '',
                'priority': row[8] or '',
                'useCases': json.loads(row[9]) if row[9] else [],
                'technologies': json.loads(row[10]) if row[10] else [],
                'relevance': row[11] or ''
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(event).encode())
            
        except Exception as e:
            self.send_error(500, f"Database error: {str(e)}")
    
    def create_event(self):
        """Create new event"""
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            event_data = json.loads(post_data.decode('utf-8'))
            
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO events (title, date, time, description, organization, website, type, priority, useCases, technologies, relevance)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                event_data.get('title', ''),
                event_data.get('date', ''),
                event_data.get('time', ''),
                event_data.get('description', ''),
                event_data.get('organization', ''),
                event_data.get('website', ''),
                event_data.get('type', ''),
                event_data.get('priority', ''),
                json.dumps(event_data.get('useCases', [])),
                json.dumps(event_data.get('technologies', [])),
                event_data.get('relevance', 'User-added event')
            ))
            event_id = cursor.lastrowid
            conn.commit()
            conn.close()
            
            response = {
                'id': event_id,
                'message': 'Event created successfully',
                'event': {**event_data, 'id': event_id}
            }
            
            self.send_response(201)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())
            
        except Exception as e:
            self.send_error(500, f"Database error: {str(e)}")
    
    def update_event(self, event_id):
        """Update existing event"""
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            event_data = json.loads(post_data.decode('utf-8'))
            
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute('''
                UPDATE events SET title = ?, date = ?, time = ?, description = ?, organization = ?, 
                website = ?, type = ?, priority = ?, useCases = ?, technologies = ?, relevance = ?
                WHERE id = ?
            ''', (
                event_data.get('title', ''),
                event_data.get('date', ''),
                event_data.get('time', ''),
                event_data.get('description', ''),
                event_data.get('organization', ''),
                event_data.get('website', ''),
                event_data.get('type', ''),
                event_data.get('priority', ''),
                json.dumps(event_data.get('useCases', [])),
                json.dumps(event_data.get('technologies', [])),
                event_data.get('relevance', 'User-added event'),
                event_id
            ))
            
            if cursor.rowcount == 0:
                conn.close()
                self.send_error(404, "Event not found")
                return
            
            conn.commit()
            conn.close()
            
            response = {'message': 'Event updated successfully'}
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())
            
        except Exception as e:
            self.send_error(500, f"Database error: {str(e)}")
    
    def delete_event(self, event_id):
        """Delete event"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute('DELETE FROM events WHERE id = ?', (event_id,))
            
            if cursor.rowcount == 0:
                conn.close()
                self.send_error(404, "Event not found")
                return
            
            conn.commit()
            conn.close()
            
            response = {'message': 'Event deleted successfully'}
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())
            
        except Exception as e:
            self.send_error(500, f"Database error: {str(e)}")
    
    def serve_index(self):
        """Serve the main HTML file"""
        try:
            with open('index.html', 'r', encoding='utf-8') as f:
                content = f.read()
            
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(content.encode())
            
        except FileNotFoundError:
            self.send_error(404, "index.html not found")
    
    def log_message(self, format, *args):
        """Override to reduce log noise"""
        pass

def run_server():
    """Start the HTTP server"""
    port = 3000
    server_address = ('', port)
    httpd = HTTPServer(server_address, CalendarAPIHandler)
    
    print(f"🚀 Calendar V17 Backend running on http://localhost:{port}")
    print(f"📅 API endpoints available at http://localhost:{port}/api/events")
    print("Press Ctrl+C to stop the server")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
