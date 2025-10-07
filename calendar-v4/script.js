// EdTech Events Calendar V4 - Clean Implementation
class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.currentView = 'month';
        this.events = [];
        this.currentUser = 'Event Creator';
        
        // Collaborative features
        this.rsvps = {};
        this.eventNotes = {};
        this.collaborationLog = {};
        
        this.init();
    }

    init() {
        this.loadEvents();
        this.setupEventListeners();
        this.render();
    }

    loadEvents() {
        // Events from the provided table only
        this.events = [
            {
                id: 1,
                title: 'AWS re:Invent 2025',
                date: '2025-12-01',
                time: '09:00',
                description: 'Amazon Web Services\' premier event unveiling innovations in AI, machine learning, and cloud-native tools. Features AWS AI services for educational institutions, including SageMaker, Bedrock, and AI-powered learning analytics.',
                organization: 'Amazon',
                type: 'conference',
                website: 'https://reinvent.awsevents.com/',
                priority: 'high',
                useCases: ['tutoring', 'navigation', 'mobility'],
                relevance: 'AWS AI services and machine learning tools for educational technology and learning analytics'
            },
            {
                id: 2,
                title: 'OpenAI DevDay 2025',
                date: '2025-10-06',
                time: '10:00',
                description: 'OpenAI\'s developer conference featuring latest GPT models, API updates, and AI applications in education. Includes workshops on building educational AI tools, content generation, and personalized tutoring systems.',
                organization: 'OpenAI',
                type: 'conference',
                website: 'https://openai.com/devday',
                priority: 'high',
                useCases: ['tutoring', 'navigation'],
                relevance: 'OpenAI\'s latest AI models and APIs for building educational tools and tutoring systems'
            },
            {
                id: 3,
                title: 'Google Cloud Next 2026',
                date: '2026-04-22',
                time: '09:00',
                description: 'Google\'s premier cloud conference showcasing AI innovations including Vertex AI, Gemini for Education, and Google Classroom AI features. Features sessions on AI-powered personalized learning and educational analytics.',
                organization: 'Google',
                type: 'conference',
                website: 'https://cloud.withgoogle.com/cloudnext/',
                priority: 'high',
                useCases: ['tutoring', 'navigation', 'mobility'],
                relevance: 'Google\'s AI education tools including Gemini, Classroom AI, and Vertex AI for educational applications'
            },
            {
                id: 4,
                title: 'ASU+GSV Summit 2026 (+ The AI Show)',
                date: '2026-04-12',
                time: '09:00',
                description: 'Industry summit with dedicated AI Show, offering immersive exploration of AI\'s educational revolution, emerging trends, practical applications, and implementation strategies.',
                organization: 'ASU+GSV',
                type: 'summit',
                website: 'https://www.asugsvsummit.com/',
                priority: 'high',
                useCases: ['tutoring', 'navigation', 'mobility'],
                relevance: 'Premier EdTech and AI summit with comprehensive programming for educational innovation'
            },
            {
                id: 5,
                title: '1EdTech Digital Credentials Summit',
                date: '2026-02-18',
                time: '09:00',
                description: 'Summit focused on digital credentials, blockchain in education, and credential portability. Features sessions on AI-powered credential verification and learner mobility solutions.',
                organization: '1EdTech',
                type: 'summit',
                website: 'https://www.1edtech.org/',
                priority: 'medium-high',
                useCases: ['mobility', 'navigation'],
                relevance: 'Digital credentials and learner mobility solutions for educational pathways'
            },
            {
                id: 6,
                title: '1EdTech Learning Impact 2026',
                date: '2026-06-01',
                time: '09:00',
                description: 'Conference on learning interoperability, standards, and data exchange in education. Features sessions on AI-powered learning analytics and educational data standards.',
                organization: '1EdTech',
                type: 'conference',
                website: 'https://www.1edtech.org/',
                priority: 'medium-high',
                useCases: ['navigation', 'mobility'],
                relevance: 'Learning interoperability and standards for educational data exchange and analytics'
            },
            {
                id: 7,
                title: 'LAK26 (Learning Analytics & Knowledge)',
                date: '2026-04-27',
                time: '09:00',
                description: 'International conference on learning analytics and educational data science. Features research on predictive analytics, learning dashboards, and data-driven insights for improving educational outcomes.',
                organization: 'SoLAR + Ui Bergen',
                type: 'research',
                website: 'https://www.solaresearch.org/lak/',
                priority: 'high',
                useCases: ['navigation', 'tutoring'],
                relevance: 'Core research conference on learning analytics and data-driven insights for educational improvement'
            },
            {
                id: 8,
                title: 'Festival of Learning 2026: EDM + L@S',
                date: '2026-06-29',
                time: '09:00',
                description: 'Co-located conference featuring Educational Data Mining (EDM) and Learning at Scale (L@S). Features cutting-edge research on AI in education, learning analytics, and educational data mining.',
                organization: 'IEDMS + ACM',
                type: 'research',
                website: 'https://fes.org/',
                priority: 'high',
                useCases: ['tutoring', 'navigation'],
                relevance: 'Premier research conference on educational data mining and learning at scale with AI applications'
            },
            {
                id: 9,
                title: 'The Web Conference 2026 (WWW)',
                date: '2026-04-13',
                time: '09:00',
                description: 'International conference on web technologies, AI, and web-based learning systems. Features sessions on AI-powered web applications for education and learning management systems.',
                organization: 'ACM & TII',
                type: 'conference',
                website: 'https://www.www2026.org/',
                priority: 'medium-high',
                useCases: ['tutoring', 'navigation', 'mobility'],
                relevance: 'Web technologies and AI applications for educational platforms and learning systems'
            },
            {
                id: 10,
                title: 'Knowledge Graphs Symposium',
                date: '2026-05-18',
                time: '09:00',
                description: 'Symposium on knowledge graphs, semantic AI, and structured knowledge for educational applications. Features sessions on building educational knowledge bases and AI reasoning systems.',
                organization: 'Bio-IT World',
                type: 'symposium',
                website: 'https://www.knowledgegraphs.org/',
                priority: 'medium-high',
                useCases: ['tutoring', 'navigation', 'mobility'],
                relevance: 'Knowledge graphs essential for intelligent tutoring systems and learning pathway navigation'
            },
            {
                id: 11,
                title: 'MCP Dev Summit NYC 2026',
                date: '2026-04-02',
                time: '09:00',
                description: 'First major conference on Model Context Protocol for AI model communication and context sharing. Features workshops on building educational AI systems with enhanced context awareness.',
                organization: 'MCP Dev Summit',
                type: 'conference',
                website: 'https://mcpdevsummit.com/',
                priority: 'medium-high',
                useCases: ['tutoring', 'navigation'],
                relevance: 'Emerging protocol for enhanced AI model communication in educational systems'
            },
            {
                id: 12,
                title: 'SEMANTICS 2026',
                date: '2026-09-15',
                time: '09:00',
                description: 'Conference on semantic technologies, knowledge graphs, and AI reasoning for educational applications. Features sessions on semantic AI and structured knowledge for learning systems.',
                organization: 'Semantic Web Community',
                type: 'conference',
                website: 'https://2026.semantics.cc/',
                priority: 'medium',
                useCases: ['tutoring', 'navigation'],
                relevance: 'Semantic technologies and knowledge graphs for intelligent educational systems'
            },
            {
                id: 13,
                title: 'NVIDIA GTC 2026',
                date: '2026-03-16',
                time: '09:00',
                description: 'NVIDIA\'s GPU Technology Conference featuring AI infrastructure, accelerated computing, and AI applications in education. Features sessions on AI model training and deployment for educational institutions.',
                organization: 'NVIDIA',
                type: 'conference',
                website: 'https://www.nvidia.com/gtc/',
                priority: 'medium-high',
                useCases: ['tutoring', 'navigation'],
                relevance: 'AI infrastructure and accelerated computing for educational AI applications'
            },
            {
                id: 14,
                title: 'Agentic AI Symposium',
                date: '2026-01-27',
                time: '09:00',
                description: 'Symposium on autonomous AI agents and multi-agent systems for education. Features cutting-edge research on AI tutors, educational assistants, and autonomous learning systems.',
                organization: 'U.S. Space & Rocket Center',
                type: 'symposium',
                website: 'https://www.usspace.org/',
                priority: 'high',
                useCases: ['tutoring', 'navigation'],
                relevance: 'Next-generation AI agents for personalized tutoring and educational assistance'
            },
            {
                id: 15,
                title: 'Meta Connect 2025',
                date: '2025-09-17',
                time: '10:00',
                description: 'Meta\'s conference on AI, AR/VR, and immersive technologies for education. Features sessions on virtual reality learning environments and AI-powered educational content creation.',
                organization: 'Meta',
                type: 'conference',
                website: 'https://www.metaconnect.com/',
                priority: 'medium',
                useCases: ['tutoring', 'navigation'],
                relevance: 'Meta\'s AI research and VR/AR applications for immersive educational experiences'
            },
            {
                id: 16,
                title: 'Oracle AI World 2025',
                date: '2025-10-13',
                time: '09:00',
                description: 'Oracle\'s conference on AI innovations, OCI (Oracle Cloud Infrastructure), and generative AI applications. Features sessions on AI-powered enterprise solutions for educational institutions.',
                organization: 'Oracle',
                type: 'conference',
                website: 'https://www.oracle.com/ai/',
                priority: 'medium-high',
                useCases: ['tutoring', 'navigation', 'mobility'],
                relevance: 'Oracle\'s AI and cloud infrastructure solutions for educational technology and enterprise applications'
            }
        ];
        
        console.log('Events loaded:', this.events.length);
    }

    setupEventListeners() {
        // Navigation
        document.getElementById('prevBtn').addEventListener('click', () => this.previousMonth());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextMonth());
        document.getElementById('todayBtn').addEventListener('click', () => this.goToToday());
        
        // View controls
        document.querySelectorAll('.btn-toggle').forEach(btn => {
            btn.addEventListener('click', () => this.setView(btn.dataset.view));
        });
        
        // Add event
        document.getElementById('addEventBtn').addEventListener('click', () => this.showAddEventModal());
        document.getElementById('addEventForm').addEventListener('submit', (e) => this.handleEventSubmit(e));
        document.getElementById('cancelAddEvent').addEventListener('click', () => this.hideAddEventModal());
        
        // Modals
        document.getElementById('closeModal').addEventListener('click', () => this.hideEventDetailsModal());
        document.getElementById('closeAddModal').addEventListener('click', () => this.hideAddEventModal());
        
        // Filters
        document.getElementById('eventTypeFilter').addEventListener('change', () => this.updateEventsList());
        document.getElementById('priorityFilter').addEventListener('change', () => this.updateEventsList());
        document.getElementById('useCaseFilter').addEventListener('change', () => this.updateEventsList());
        document.getElementById('organizationFilter').addEventListener('change', () => this.updateEventsList());
        document.getElementById('technologyFilter').addEventListener('change', () => this.updateEventsList());
        document.getElementById('sortFilter').addEventListener('change', () => this.updateEventsList());
        
        // Close modals on outside click
        document.getElementById('eventDetailsModal').addEventListener('click', (e) => {
            if (e.target.id === 'eventDetailsModal') this.hideEventDetailsModal();
        });
        document.getElementById('addEventModal').addEventListener('click', (e) => {
            if (e.target.id === 'addEventModal') this.hideAddEventModal();
        });
    }

    render() {
        this.updateHeader();
        this.renderCalendar();
        this.updateSidebar();
        this.updateEventsList();
    }

    updateHeader() {
        const options = { year: 'numeric', month: 'long' };
        const monthYear = this.currentDate.toLocaleDateString('en-US', options);
        document.querySelector('.month-year').textContent = monthYear;
    }

    renderCalendar() {
        const calendarGrid = document.querySelector('.calendar-grid');
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        // Day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let calendarHTML = '';
        
        dayHeaders.forEach(day => {
            calendarHTML += `<div class="day-header">${day}</div>`;
        });
        
        // Previous month days
        const prevMonth = new Date(year, month - 1, 0);
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const day = prevMonth.getDate() - i;
            calendarHTML += `<div class="calendar-day other-month">${day}</div>`;
        }
        
        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = this.isSameDay(date, new Date());
            const dayEvents = this.getEventsForDate(date);
            
            calendarHTML += `
                <div class="calendar-day ${isToday ? 'today' : ''}" data-date="${this.formatDateForInput(date)}">
                    <div class="day-number">${day}</div>
                    <div class="day-events">
                        ${dayEvents.map(event => `
                            <div class="event-dot ${event.priority}-priority" onclick="window.calendar.showEventDetails(${event.id})">
                                ${event.title}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        // Next month days
        const totalCells = 42; // 6 weeks * 7 days
        const remainingCells = totalCells - (startingDayOfWeek + daysInMonth);
        for (let day = 1; day <= remainingCells; day++) {
            calendarHTML += `<div class="calendar-day other-month">${day}</div>`;
        }
        
        calendarGrid.innerHTML = calendarHTML;
    }

    getEventsForDate(date) {
        return this.events.filter(event => {
            const eventDate = new Date(event.date);
            return this.isSameDay(eventDate, date);
        });
    }

    isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    formatDateForInput(date) {
        return date.toISOString().split('T')[0];
    }

    formatEventDate(event) {
        if (!event || !event.date) return 'Date TBD';
        
        const date = new Date(event.date);
        if (isNaN(date.getTime())) return 'Date TBD';
        
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        return event.time ? `${formattedDate} at ${event.time}` : formattedDate;
    }

    showEventDetails(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;
        
        document.getElementById('modalEventTitle').textContent = event.title;
        
        const detailsHTML = `
            <div class="event-details">
                <div class="detail-row"><strong>Date:</strong> ${this.formatEventDate(event)}</div>
                <div class="detail-row"><strong>Organization:</strong> ${event.organization}</div>
                <div class="detail-row"><strong>Type:</strong> ${this.formatEventType(event.type)}</div>
                <div class="detail-row"><strong>Priority:</strong> <span class="priority-badge ${event.priority}">${this.formatPriority(event.priority)}</span></div>
                ${event.useCases ? `<div class="detail-row"><strong>Use Cases:</strong> ${this.formatUseCases(event.useCases)}</div>` : ''}
                ${event.website ? `<div class="detail-row"><strong>Website:</strong> <a href="${event.website}" target="_blank" style="color: #4f46e5;">Visit Website →</a></div>` : ''}
                ${event.description ? `<div class="detail-row"><strong>Description:</strong> ${event.description}</div>` : ''}
                ${event.relevance ? `<div class="detail-row"><strong>Relevance:</strong> ${event.relevance}</div>` : ''}
            </div>
        `;
        
        document.getElementById('modalEventDetails').innerHTML = detailsHTML;
        document.getElementById('eventDetailsModal').style.display = 'flex';
    }

    hideEventDetailsModal() {
        document.getElementById('eventDetailsModal').style.display = 'none';
    }

    showAddEventModal() {
        document.getElementById('addEventModal').style.display = 'flex';
    }

    hideAddEventModal() {
        document.getElementById('addEventModal').style.display = 'none';
        document.getElementById('addEventForm').reset();
    }

    handleEventSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const useCases = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
        
        const newEvent = {
            id: Date.now(),
            title: document.getElementById('eventTitle').value,
            date: document.getElementById('eventDate').value,
            time: document.getElementById('eventTime').value,
            description: document.getElementById('eventDescription').value,
            organization: document.getElementById('eventOrganization').value,
            website: document.getElementById('eventWebsite').value,
            type: document.getElementById('eventType').value,
            priority: document.getElementById('eventPriority').value,
            useCases: useCases,
            relevance: 'User-added event'
        };
        
        this.events.push(newEvent);
        this.render();
        this.hideAddEventModal();
        
        console.log('Event added:', newEvent);
    }

    updateSidebar() {
        this.updateTodayEvents();
        this.updateUpcomingEvents();
        this.updateEventStats();
    }

    updateTodayEvents() {
        const todayEvents = this.getEventsForDate(new Date());
        const container = document.getElementById('todayEvents');
        
        if (todayEvents.length === 0) {
            container.innerHTML = '<div style="color: #9ca3af; font-style: italic;">No events today</div>';
            return;
        }
        
        container.innerHTML = todayEvents.map(event => `
            <div class="event-item" onclick="window.calendar.showEventDetails(${event.id})">
                <div class="event-title">${event.title}</div>
                <div class="event-time">${event.time || 'All day'}</div>
            </div>
        `).join('');
    }

    updateUpcomingEvents() {
        const upcomingEvents = this.getUpcomingEvents();
        const container = document.getElementById('upcomingEvents');
        
        if (upcomingEvents.length === 0) {
            container.innerHTML = '<div style="color: #9ca3af; font-style: italic;">No upcoming events</div>';
            return;
        }
        
        container.innerHTML = upcomingEvents.slice(0, 5).map(event => `
            <div class="event-item" onclick="window.calendar.showEventDetails(${event.id})">
                <div class="event-title">${event.title}</div>
                <div class="event-time">${this.formatEventDate(event)}</div>
            </div>
        `).join('');
    }

    getUpcomingEvents() {
        const today = new Date();
        return this.events
            .filter(event => {
                const eventDate = new Date(event.date);
                return eventDate >= today;
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    updateEventStats() {
        const stats = {
            total: this.events.length,
            high: this.events.filter(e => e.priority === 'high').length,
            conferences: this.events.filter(e => e.type === 'conference').length,
            workshops: this.events.filter(e => e.type === 'workshop').length
        };
        
        document.getElementById('eventStats').innerHTML = `
            <div class="activity-item">
                <span class="activity-label">Total Events</span>
                <span class="activity-count">${stats.total}</span>
            </div>
            <div class="activity-item">
                <span class="activity-label">High Priority</span>
                <span class="activity-count">${stats.high}</span>
            </div>
            <div class="activity-item">
                <span class="activity-label">Conferences</span>
                <span class="activity-count">${stats.conferences}</span>
            </div>
            <div class="activity-item">
                <span class="activity-label">Workshops</span>
                <span class="activity-count">${stats.workshops}</span>
            </div>
        `;
    }

    updateEventsList() {
        const container = document.getElementById('eventsList');
        const typeFilter = document.getElementById('eventTypeFilter').value;
        const priorityFilter = document.getElementById('priorityFilter').value;
        const useCaseFilter = document.getElementById('useCaseFilter').value;
        const organizationFilter = document.getElementById('organizationFilter').value;
        const technologyFilter = document.getElementById('technologyFilter').value;
        const sortFilter = document.getElementById('sortFilter').value;
        
        let filteredEvents = this.events;
        
        if (typeFilter !== 'all') {
            filteredEvents = filteredEvents.filter(event => event.type === typeFilter);
        }
        
        if (priorityFilter !== 'all') {
            filteredEvents = filteredEvents.filter(event => event.priority === priorityFilter);
        }
        
        if (useCaseFilter !== 'all') {
            filteredEvents = filteredEvents.filter(event => 
                event.useCases && event.useCases.includes(useCaseFilter)
            );
        }
        
        if (organizationFilter !== 'all') {
            filteredEvents = filteredEvents.filter(event => 
                event.organization === organizationFilter
            );
        }
        
        if (technologyFilter !== 'all') {
            filteredEvents = filteredEvents.filter(event => 
                event.technologies && event.technologies.includes(technologyFilter)
            );
        }
        
        // Sort events
        if (sortFilter === 'date') {
            filteredEvents = filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (sortFilter === 'priority') {
            const priorityOrder = { 'high': 1, 'medium-high': 2, 'medium': 3, 'medium-low': 4 };
            filteredEvents = filteredEvents.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        } else if (sortFilter === 'title') {
            filteredEvents = filteredEvents.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortFilter === 'organization') {
            filteredEvents = filteredEvents.sort((a, b) => a.organization.localeCompare(b.organization));
        }
        
        if (filteredEvents.length === 0) {
            container.innerHTML = '<div style="text-align: center; color: #9ca3af; padding: 2rem;">No events found.</div>';
            return;
        }
        
        container.innerHTML = filteredEvents.map(event => `
            <div class="event-card" onclick="window.calendar.showEventDetails(${event.id})">
                <div class="event-card-header">
                    <div>
                        <div class="event-title">${event.title}</div>
                        <div class="event-date">${this.formatEventDate(event)}</div>
                        <div class="event-organization">${event.organization}</div>
                    </div>
                    <div class="event-badges">
                        <span class="priority-badge ${event.priority}">${this.formatPriority(event.priority)}</span>
                        <span class="event-type-badge ${event.type}">${this.formatEventType(event.type)}</span>
                    </div>
                </div>
                ${event.description ? `<div class="event-description">${event.description.substring(0, 150)}${event.description.length > 150 ? '...' : ''}</div>` : ''}
                ${event.useCases ? `
                    <div class="event-use-cases">
                        ${event.useCases.map(uc => `<span class="use-case-tag">${this.formatUseCase(uc)}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    // Utility methods
    formatUseCases(useCases) {
        const labels = {
            'tutoring': 'Tutoring & Learning Instruction',
            'navigation': 'Navigation & Advising',
            'mobility': 'Learner Mobility'
        };
        return useCases.map(uc => labels[uc] || uc).join(', ');
    }

    formatUseCase(useCase) {
        const labels = {
            'tutoring': 'Tutoring & Learning',
            'navigation': 'Navigation & Advising',
            'mobility': 'Learner Mobility'
        };
        return labels[useCase] || useCase;
    }

    formatEventType(type) {
        const labels = {
            'conference': 'Conference',
            'summit': 'Summit',
            'workshop': 'Workshop',
            'research': 'Research Conference',
            'symposium': 'Symposium'
        };
        return labels[type] || type;
    }

    formatPriority(priority) {
        const labels = {
            'high': 'High Priority',
            'medium-high': 'Medium-High Priority',
            'medium': 'Medium Priority',
            'medium-low': 'Medium-Low Priority'
        };
        return labels[priority] || priority;
    }

    // Navigation methods
    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.render();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.render();
    }

    goToToday() {
        this.currentDate = new Date();
        this.render();
    }

    setView(view) {
        this.currentView = view;
        
        // Update active button
        document.querySelectorAll('.btn-toggle').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        this.render();
    }
}

// Initialize calendar when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.calendar = new Calendar();
    console.log('EdTech Events Calendar V4 initialized');
});