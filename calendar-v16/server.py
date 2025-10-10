from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import json
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

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

# Initialize database on startup
init_db()

# Helper function to convert Row to dict
def row_to_dict(row):
    return dict(zip(row.keys(), row))

# ==================== API Routes ====================

# Health check
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'message': 'Calendar API is running (Python/Flask)',
        'database': 'SQLite'
    })

# ==================== Colleagues ====================

@app.route('/api/colleagues', methods=['GET'])
def get_colleagues():
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM colleagues ORDER BY registered_at DESC')
        colleagues = [row_to_dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify(colleagues)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/colleagues', methods=['POST'])
def add_colleague():
    try:
        data = request.json
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT OR REPLACE INTO colleagues (id, name, registered_at)
            VALUES (?, ?, ?)
        ''', (data['id'], data['name'], data.get('registeredAt', datetime.now().isoformat())))
        
        conn.commit()
        
        cursor.execute('SELECT * FROM colleagues WHERE id = ?', (data['id'],))
        colleague = row_to_dict(cursor.fetchone())
        conn.close()
        
        return jsonify(colleague)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/colleagues/<int:colleague_id>', methods=['DELETE'])
def remove_colleague(colleague_id):
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM colleagues WHERE id = ?', (colleague_id,))
        cursor.execute('DELETE FROM attendance WHERE user_id = ?', (colleague_id,))
        cursor.execute('DELETE FROM interests WHERE user_id = ?', (colleague_id,))
        cursor.execute('DELETE FROM event_registrations WHERE user_id = ?', (colleague_id,))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Colleague removed successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== Events ====================

@app.route('/api/events', methods=['GET'])
def get_events():
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM events ORDER BY date ASC')
        
        events = []
        for row in cursor.fetchall():
            event = row_to_dict(row)
            # Parse JSON fields
            event['useCases'] = json.loads(event['use_cases']) if event['use_cases'] else []
            event['technologies'] = json.loads(event['technologies']) if event['technologies'] else []
            events.append(event)
        
        conn.close()
        return jsonify(events)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events', methods=['POST'])
def add_event():
    try:
        data = request.json
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT OR REPLACE INTO events 
            (id, title, date, time, description, organization, website, type, priority, use_cases, technologies, relevance)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['id'],
            data['title'],
            data['date'],
            data.get('time'),
            data.get('description'),
            data.get('organization'),
            data.get('website'),
            data.get('type'),
            data.get('priority'),
            json.dumps(data.get('useCases', [])),
            json.dumps(data.get('technologies', [])),
            data.get('relevance')
        ))
        
        conn.commit()
        
        cursor.execute('SELECT * FROM events WHERE id = ?', (data['id'],))
        event = row_to_dict(cursor.fetchone())
        conn.close()
        
        return jsonify(event)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== Attendance ====================

@app.route('/api/attendance/<int:event_id>', methods=['GET'])
def get_attendance(event_id):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT user_id as id, user_name as name, timestamp 
            FROM attendance 
            WHERE event_id = ? 
            ORDER BY timestamp DESC
        ''', (event_id,))
        
        attendance = [row_to_dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify(attendance)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/attendance', methods=['POST'])
def add_attendance():
    try:
        data = request.json
        conn = get_db()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT INTO attendance (event_id, user_id, user_name)
                VALUES (?, ?, ?)
            ''', (data['eventId'], data['userId'], data['userName']))
            conn.commit()
            message = {'message': 'Attendance added'}
        except sqlite3.IntegrityError:
            message = {'message': 'Already exists'}
        
        conn.close()
        return jsonify(message)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/attendance/<int:event_id>/<int:user_id>', methods=['DELETE'])
def remove_attendance(event_id, user_id):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM attendance WHERE event_id = ? AND user_id = ?', (event_id, user_id))
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Attendance removed'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== Interests ====================

@app.route('/api/interests/<int:event_id>', methods=['GET'])
def get_interests(event_id):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT user_id as id, user_name as name, timestamp 
            FROM interests 
            WHERE event_id = ? 
            ORDER BY timestamp DESC
        ''', (event_id,))
        
        interests = [row_to_dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify(interests)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/interests', methods=['POST'])
def add_interest():
    try:
        data = request.json
        conn = get_db()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT INTO interests (event_id, user_id, user_name)
                VALUES (?, ?, ?)
            ''', (data['eventId'], data['userId'], data['userName']))
            conn.commit()
            message = {'message': 'Interest added'}
        except sqlite3.IntegrityError:
            message = {'message': 'Already exists'}
        
        conn.close()
        return jsonify(message)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/interests/<int:event_id>/<int:user_id>', methods=['DELETE'])
def remove_interest(event_id, user_id):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM interests WHERE event_id = ? AND user_id = ?', (event_id, user_id))
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Interest removed'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== Event Registrations ====================

@app.route('/api/registrations/<int:event_id>', methods=['GET'])
def get_registrations(event_id):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT user_id as id, user_name as name, timestamp 
            FROM event_registrations 
            WHERE event_id = ? 
            ORDER BY timestamp DESC
        ''', (event_id,))
        
        registrations = [row_to_dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify(registrations)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/registrations', methods=['POST'])
def add_registration():
    try:
        data = request.json
        conn = get_db()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT INTO event_registrations (event_id, user_id, user_name)
                VALUES (?, ?, ?)
            ''', (data['eventId'], data['userId'], data['userName']))
            conn.commit()
            message = {'message': 'Registration added'}
        except sqlite3.IntegrityError:
            message = {'message': 'Already exists'}
        
        conn.close()
        return jsonify(message)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/registrations/<int:event_id>/<int:user_id>', methods=['DELETE'])
def remove_registration(event_id, user_id):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM event_registrations WHERE event_id = ? AND user_id = ?', (event_id, user_id))
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Registration removed'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== Notes ====================

@app.route('/api/notes/<int:event_id>', methods=['GET'])
def get_notes(event_id):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT id, author, title, content, note_type as type, timestamp, edited, last_edited as lastEdited
            FROM notes 
            WHERE event_id = ? 
            ORDER BY timestamp DESC
        ''', (event_id,))
        
        notes = [row_to_dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify(notes)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/notes', methods=['POST'])
def add_note():
    try:
        data = request.json
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO notes (id, event_id, author, title, content, note_type)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            data['id'],
            data['eventId'],
            data['author'],
            data.get('title'),
            data['content'],
            data.get('type', 'general')
        ))
        
        conn.commit()
        
        cursor.execute('SELECT * FROM notes WHERE id = ?', (data['id'],))
        note = row_to_dict(cursor.fetchone())
        conn.close()
        
        return jsonify(note)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/notes/<int:note_id>', methods=['PUT'])
def update_note(note_id):
    try:
        data = request.json
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE notes 
            SET content = ?, edited = 1, last_edited = ?
            WHERE id = ?
        ''', (data['content'], datetime.now().isoformat(), note_id))
        
        conn.commit()
        
        cursor.execute('SELECT * FROM notes WHERE id = ?', (note_id,))
        note = row_to_dict(cursor.fetchone())
        conn.close()
        
        return jsonify(note)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/notes/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM notes WHERE id = ?', (note_id,))
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Note deleted'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== Collaboration Log ====================

@app.route('/api/collaboration-log', methods=['GET'])
def get_collaboration_log():
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM collaboration_log ORDER BY timestamp DESC LIMIT 50')
        
        logs = [row_to_dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify(logs)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/collaboration-log', methods=['POST'])
def add_collaboration_log():
    try:
        data = request.json
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO collaboration_log (id, action, colleague, details)
            VALUES (?, ?, ?, ?)
        ''', (data['id'], data['action'], data['colleague'], data.get('details')))
        
        conn.commit()
        
        cursor.execute('SELECT * FROM collaboration_log WHERE id = ?', (data['id'],))
        log = row_to_dict(cursor.fetchone())
        conn.close()
        
        return jsonify(log)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== Start Server ====================

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3000))
    print(f'''
╔════════════════════════════════════════════╗
║  🎉 Calendar Backend Server Started!      ║
║                                            ║
║  🌐 Server: http://localhost:{port}       ║
║  🏥 Health: http://localhost:{port}/api/health
║  📊 Database: SQLite (calendar.db)        ║
║                                            ║
║  Press CTRL+C to stop                      ║
╚════════════════════════════════════════════╝
    ''')
    app.run(host='0.0.0.0', port=port, debug=True)

