// API Configuration
// Change this to your Railway URL after deployment
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api' 
  : '/api'; // Railway will serve from same domain

class CalendarAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic API call method
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Colleagues
  async getColleagues() {
    return this.request('/colleagues');
  }

  async addColleague(colleague) {
    return this.request('/colleagues', {
      method: 'POST',
      body: JSON.stringify(colleague)
    });
  }

  async removeColleague(id) {
    return this.request(`/colleagues/${id}`, {
      method: 'DELETE'
    });
  }

  // Events
  async getEvents() {
    return this.request('/events');
  }

  async addEvent(event) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(event)
    });
  }

  // Attendance
  async getAttendance(eventId) {
    return this.request(`/attendance/${eventId}`);
  }

  async addAttendance(eventId, userId, userName) {
    return this.request('/attendance', {
      method: 'POST',
      body: JSON.stringify({ eventId, userId, userName })
    });
  }

  async removeAttendance(eventId, userId) {
    return this.request(`/attendance/${eventId}/${userId}`, {
      method: 'DELETE'
    });
  }

  // Interests
  async getInterests(eventId) {
    return this.request(`/interests/${eventId}`);
  }

  async addInterest(eventId, userId, userName) {
    return this.request('/interests', {
      method: 'POST',
      body: JSON.stringify({ eventId, userId, userName })
    });
  }

  async removeInterest(eventId, userId) {
    return this.request(`/interests/${eventId}/${userId}`, {
      method: 'DELETE'
    });
  }

  // Event Registrations
  async getRegistrations(eventId) {
    return this.request(`/registrations/${eventId}`);
  }

  async addRegistration(eventId, userId, userName) {
    return this.request('/registrations', {
      method: 'POST',
      body: JSON.stringify({ eventId, userId, userName })
    });
  }

  async removeRegistration(eventId, userId) {
    return this.request(`/registrations/${eventId}/${userId}`, {
      method: 'DELETE'
    });
  }

  // Notes
  async getNotes(eventId) {
    return this.request(`/notes/${eventId}`);
  }

  async addNote(note) {
    return this.request('/notes', {
      method: 'POST',
      body: JSON.stringify(note)
    });
  }

  async updateNote(id, content) {
    return this.request(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ content })
    });
  }

  async deleteNote(id) {
    return this.request(`/notes/${id}`, {
      method: 'DELETE'
    });
  }

  // Collaboration Log
  async getCollaborationLog() {
    return this.request('/collaboration-log');
  }

  async addToCollaborationLog(entry) {
    return this.request('/collaboration-log', {
      method: 'POST',
      body: JSON.stringify(entry)
    });
  }
}

// Export API instance
window.calendarAPI = new CalendarAPI();


