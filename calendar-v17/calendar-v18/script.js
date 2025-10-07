// EdTech Events Calendar V16 - Clean Implementation
class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.currentView = 'month';
        this.events = [];
        this.currentUser = null;
        this.currentEventId = null;
        
        // Simple collaboration for attendance tracking
        this.attendance = {}; // Store who is attending each event
        
        this.init();
    }

    init() {
        this.loadEvents();
        this.loadAttendanceData();
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
                website: 'https://openai.com/index/announcing-devday-2025/',
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
                website: 'https://cloud.withgoogle.com/next/25',
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
                website: 'https://www.1edtech.org/events',
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
                website: 'https://www.1edtech.org/event/li/2026',
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
                website: 'https://www.solaresearch.org/events/lak/',
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
                website: 'https://festival-of-learning-2026.info/participating-conferences/',
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
                website: 'https://www2026.thewebconf.org/calls/research-tracks.html',
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
                website: 'https://www.bio-itworldexpo.com/knowledge-graphs',
                priority: 'medium-high',
                useCases: ['tutoring', 'navigation', 'mobility'],
                technologies: ['Knowledge Graph', 'AI in Education'],
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
                website: 'https://mcpdevsummit.ai/',
                priority: 'medium-high',
                useCases: ['tutoring', 'navigation'],
                technologies: ['MCP', 'AI in Education'],
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
                website: 'https://2026-eu.semantics.cc/',
                priority: 'medium',
                useCases: ['tutoring', 'navigation'],
                technologies: ['Knowledge Graph', 'AI in Education'],
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
                website: 'https://www.rocketcenter.com/2026-AI-Symposium',
                priority: 'high',
                useCases: ['tutoring', 'navigation'],
                technologies: ['Agentic AI', 'AI in Education'],
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
                website: 'https://www.meta.com/connect/',
                priority: 'medium',
                useCases: ['tutoring', 'navigation'],
                technologies: ['AI in Education', 'Learning Analytics'],
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
                website: 'https://www.oracle.com/ai-world/faq/',
                priority: 'medium-high',
                useCases: ['tutoring', 'navigation', 'mobility'],
                relevance: 'Oracle\'s AI and cloud infrastructure solutions for educational technology and enterprise applications'
            },
            {
                id: 17,
                title: 'Workshop on Benchmarks for Human Flourishing with AI',
                date: '2025-10-14',
                time: '09:00',
                description: 'Collaborative workshop organized by MIT Media Lab\'s Advancing Humans with AI (AHA) research program. This action-oriented workshop focuses on developing rigorous assessment frameworks that measure how AI systems contribute to human flourishing across six key dimensions: Comprehension & Agency, Curiosity & Learning, Creativity & Expression, Physical & Mental Wellbeing, Healthy Social Lives, and Sense of Purpose. Features working group collaboration, tangible deliverables, and three methodological approaches: Interactive Human-AI Behavior Classification, Randomized Controlled Trials, and Human-AI Interaction Simulation.',
                organization: 'MIT Media Lab - AHA',
                type: 'workshop',
                website: 'https://www.media.mit.edu/events/aha-flourishing-workshop/',
                priority: 'high',
                useCases: ['tutoring', 'navigation', 'mobility'],
                relevance: 'MIT Media Lab\'s cutting-edge research on measuring AI\'s impact on human flourishing with direct applications to educational AI systems and learning outcomes. Application deadline: August 1, 2025.'
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
        
        // Store current event ID and show collaboration features
        this.currentEventId = eventId;
        this.showCollaborationFeatures(eventId);
        
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

    showColleagueModal() {
        document.getElementById('colleagueModal').style.display = 'flex';
    }

    hideColleagueModal() {
        document.getElementById('colleagueModal').style.display = 'none';
        document.getElementById('colleagueForm').reset();
    }

    handleColleagueSubmit(e) {
        e.preventDefault();
        
        const name = document.getElementById('colleagueName').value;
        
        const colleague = this.registerColleague(name);
        this.currentUser = colleague;
        
        this.hideColleagueModal();
        this.updateCollaborationActivity();
        
        // Refresh the current event details if a modal is open
        const eventDetailsModal = document.getElementById('eventDetailsModal');
        if (eventDetailsModal.style.display === 'flex' && this.currentEventId) {
            this.addCollaborationFeatures(this.currentEventId);
        }
        
        alert(`Welcome ${name}! You're now registered as a colleague. You can now express interest, mark attendance, and add collaborative notes to events.`);
        
        // Refresh any open event modal
        this.refreshCurrentEventModal();
    }

    refreshCurrentEventModal() {
        const eventDetailsModal = document.getElementById('eventDetailsModal');
        if (eventDetailsModal.style.display === 'flex' && this.currentEventId) {
            this.addCollaborationFeatures(this.currentEventId);
        }
    }

    removeYourself() {
        if (!this.currentUser) return;
        
        if (confirm(`Are you sure you want to remove yourself (${this.currentUser.name}) from the colleagues list? This will remove you from all events and collaboration features.`)) {
            // Remove from colleagues list
            this.colleagues = this.colleagues.filter(c => c.id !== this.currentUser.id);
            this.saveColleagues();
            
            // Remove from all attendance lists
            Object.keys(this.attendance).forEach(eventId => {
                this.attendance[eventId] = this.attendance[eventId].filter(a => a.id !== this.currentUser.id);
            });
            
            // Remove from all interests lists
            Object.keys(this.interests).forEach(eventId => {
                this.interests[eventId] = this.interests[eventId].filter(i => i.id !== this.currentUser.id);
            });
            
            // Save updated collaboration data
            this.saveCollaborationData();
            
            // Clear current user
            this.currentUser = null;
            
            // Update UI
            this.updateColleaguesList();
            this.updateCollaborationActivity();
            
            // Refresh current event modal if open
            this.refreshCurrentEventModal();
            
            alert('You have been removed from the colleagues list. You can register again anytime.');
        }
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear ALL data? This will remove all colleagues, attendance, interests, and notes. This action cannot be undone.')) {
            // Clear all localStorage data
            localStorage.removeItem('calendarColleagues');
            localStorage.removeItem('calendarRSVPs');
            localStorage.removeItem('calendarNotes');
            localStorage.removeItem('calendarLog');
            localStorage.removeItem('calendarAttendance');
            localStorage.removeItem('calendarInterests');
            
            // Reset all data structures
            this.colleagues = [];
            this.rsvps = {};
            this.eventNotes = {};
            this.collaborationLog = {};
            this.attendance = {};
            this.interests = {};
            this.currentUser = null;
            
            // Update UI
            this.updateColleaguesList();
            this.updateCollaborationActivity();
            this.refreshCurrentEventModal();
            
            alert('All data has been cleared. The calendar is now reset to its initial state.');
        }
    }

    getCurrentEventIdFromModal() {
        // Try to find the current event ID from the collaboration footer
        const footer = document.getElementById('collaborationFooter');
        if (footer && footer.innerHTML) {
            // Look for onclick attributes that contain event IDs
            const matches = footer.innerHTML.match(/onclick="window\.calendar\.(toggleInterest|toggleAttendance)\((\d+)\)"/);
            if (matches && matches[2]) {
                return parseInt(matches[2]);
            }
        }
        return null;
    }

    handleEventSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const useCases = Array.from(document.querySelectorAll('input[name="useCases"]:checked')).map(cb => cb.value);
        const technologies = Array.from(document.querySelectorAll('input[name="technologies"]:checked')).map(cb => cb.value);
        
        const newEvent = {
            id: Date.now(),
            title: document.getElementById('eventTitle').value,
            date: document.getElementById('eventDate').value,
            time: document.getElementById('eventTime').value || '',
            description: document.getElementById('eventDescription').value,
            organization: document.getElementById('eventOrganization').value,
            website: document.getElementById('eventWebsite').value,
            type: document.getElementById('eventType').value,
            priority: document.getElementById('eventPriority').value,
            useCases: useCases,
            technologies: technologies,
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
            <div class="event-item" data-event-id="${event.id}" style="cursor: pointer;">
                <div class="event-title">${event.title}</div>
                <div class="event-time">${event.time || 'All day'}</div>
            </div>
        `).join('');
        
        // Add click event listeners to today's events
        container.querySelectorAll('.event-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const eventId = parseInt(item.dataset.eventId);
                this.showEventDetails(eventId);
            });
        });
    }

    updateUpcomingEvents() {
        const upcomingEvents = this.getUpcomingEvents();
        const container = document.getElementById('upcomingEvents');
        
        if (upcomingEvents.length === 0) {
            container.innerHTML = '<div style="color: #9ca3af; font-style: italic;">No upcoming events</div>';
            return;
        }
        
        container.innerHTML = upcomingEvents.slice(0, 5).map(event => `
            <div class="event-item" data-event-id="${event.id}" style="cursor: pointer;">
                <div class="event-title">${event.title}</div>
                <div class="event-time">${this.formatEventDate(event)}</div>
            </div>
        `).join('');
        
        // Add click event listeners to upcoming events
        container.querySelectorAll('.event-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const eventId = parseInt(item.dataset.eventId);
                this.showEventDetails(eventId);
            });
        });
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
        const useCaseFilter = document.getElementById('useCaseFilter').value;
        const organizationFilter = document.getElementById('organizationFilter').value;
        const technologyFilter = document.getElementById('technologyFilter').value;
        const sortFilter = document.getElementById('sortFilter').value;
        
        let filteredEvents = this.events;
        
        if (typeFilter !== 'all') {
            filteredEvents = filteredEvents.filter(event => event.type === typeFilter);
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
            <div class="event-card" data-event-id="${event.id}" style="cursor: pointer;">
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
        
        // Add click event listeners to event cards
        container.querySelectorAll('.event-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const eventId = parseInt(card.dataset.eventId);
                this.showEventDetails(eventId);
            });
        });
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

    // Collaboration Methods
    loadColleagues() {
        const stored = localStorage.getItem('calendarColleagues');
        if (stored) {
            this.colleagues = JSON.parse(stored);
        }
        this.updateColleaguesList();
    }

    saveColleagues() {
        localStorage.setItem('calendarColleagues', JSON.stringify(this.colleagues));
    }

    loadCollaborationData() {
        const storedRSVPs = localStorage.getItem('calendarRSVPs');
        const storedNotes = localStorage.getItem('calendarNotes');
        const storedLog = localStorage.getItem('calendarLog');
        const storedAttendance = localStorage.getItem('calendarAttendance');
        const storedInterests = localStorage.getItem('calendarInterests');
        const storedEventRegistrations = localStorage.getItem('calendarEventRegistrations');

        if (storedRSVPs) this.rsvps = JSON.parse(storedRSVPs);
        if (storedNotes) this.eventNotes = JSON.parse(storedNotes);
        if (storedLog) this.collaborationLog = JSON.parse(storedLog);
        if (storedAttendance) this.attendance = JSON.parse(storedAttendance);
        if (storedInterests) this.interests = JSON.parse(storedInterests);
        if (storedEventRegistrations) this.eventRegistrations = JSON.parse(storedEventRegistrations);
    }

    saveCollaborationData() {
        localStorage.setItem('calendarRSVPs', JSON.stringify(this.rsvps));
        localStorage.setItem('calendarNotes', JSON.stringify(this.eventNotes));
        localStorage.setItem('calendarLog', JSON.stringify(this.collaborationLog));
        localStorage.setItem('calendarAttendance', JSON.stringify(this.attendance));
        localStorage.setItem('calendarInterests', JSON.stringify(this.interests));
        localStorage.setItem('calendarEventRegistrations', JSON.stringify(this.eventRegistrations));
    }

    registerColleague(name) {
        const colleague = {
            id: Date.now(),
            name: name,
            registeredAt: new Date().toISOString()
        };
        
        this.colleagues.push(colleague);
        this.saveColleagues();
        this.updateColleaguesList();
        this.logCollaboration('colleague_registered', colleague.name, `New colleague registered: ${colleague.name}`);
        
        return colleague;
    }

    updateColleaguesList() {
        const container = document.getElementById('colleaguesList');
        if (this.colleagues.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 1rem; background: #f8fafc; border-radius: 0.5rem; border: 1px solid #e2e8f0;">
                    <div style="font-size: 1.5rem; margin-bottom: 0.5rem;"></div>
                    <div style="color: #64748b; font-weight: 600; margin-bottom: 0.5rem;">No colleagues yet</div>
                    <div style="color: #64748b; font-size: 0.875rem;">Be the first to register and start collaborating!</div>
                </div>
            `;
            return;
        }

        container.innerHTML = this.colleagues.map(colleague => `
            <div class="colleague-item" style="padding: 0.5rem; border-bottom: 1px solid #e5e7eb;">
                <div style="font-weight: 600; color: #374151;">${colleague.name}</div>
            </div>
        `).join('');
    }


    addCollaborationFeatures(eventId) {
        const footer = document.getElementById('collaborationFooter');
        footer.style.display = 'block';
        
        const event = this.events.find(e => e.id === eventId);
        const attendees = this.attendance[eventId] || [];
        const interested = this.interests[eventId] || [];
        const notes = this.eventNotes[eventId] || [];
        
        footer.innerHTML = `
            <div class="collaboration-section">
                <h4>Event Collaboration</h4>
                
                <!-- Interested Section -->
                <div class="interested-section" style="padding: 1rem; background: #fef3c7; border-radius: 0.5rem; border: 1px solid #f59e0b; margin-bottom: 1rem;">
                    <h5 style="color: #92400e; font-size: 1rem; margin-bottom: 0.5rem;">Interested (${(this.eventRegistrations[eventId] || []).length})</h5>
                    <div class="interested-list">
                        ${(this.eventRegistrations[eventId] || []).length === 0 ? '<div style="color: #9ca3af; font-style: italic;">No one registered for this event yet</div>' : 
                          (this.eventRegistrations[eventId] || []).map(colleague => `
                            <div class="interested-item" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0; border-bottom: 1px solid #fbbf24;">
                                <div class="avatar" style="width: 2rem; height: 2rem; border-radius: 50%; background: linear-gradient(135deg, #f59e0b, #d97706); display: flex; align-items: center; justify-content: center; color: white; font-size: 0.75rem; font-weight: 600;">${colleague.name.charAt(0)}</div>
                                <div>
                                    <div style="font-weight: 600; color: #374151; font-size: 1rem;">${colleague.name}</div>
                                    <div style="font-size: 0.75rem; color: #9ca3af;">Registered ${new Date(colleague.timestamp).toLocaleDateString()}</div>
                                </div>
                            </div>
                          `).join('')}
                    </div>
                    
                    ${this.currentUser ? `
                        <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                            <button onclick="window.calendar.toggleEventRegistration(${eventId})" class="interest-btn" style="background: #f59e0b; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.375rem; cursor: pointer;">
                                ${(this.eventRegistrations[eventId] || []).find(r => r.id === this.currentUser.id) ? 'Unregister from Event' : 'Register for Event'}
                            </button>
                            <button onclick="window.calendar.toggleInterest(${eventId})" class="interest-btn" style="background: #3b82f6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.375rem; cursor: pointer;">
                                ${interested.find(i => i.id === this.currentUser.id) ? 'Remove from Interested' : 'Mark as Interested'}
                            </button>
                        </div>
                    ` : `
                        <div style="margin-top: 0.5rem;">
                            <div style="color: #6b7280; font-size: 0.875rem; margin-bottom: 0.5rem;">Register as colleague to express interest and add notes</div>
                            <button onclick="window.calendar.showColleagueModal()" style="background: #10b981; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.375rem; cursor: pointer;">
                                Register as Colleague
                            </button>
                        </div>
                    `}
                </div>
                
                <!-- Actually Join Section -->
                <div class="attendance-section" style="margin-top: 1rem; padding: 1rem; background: #f0fdf4; border-radius: 0.5rem; border: 1px solid #10b981; margin-bottom: 1rem;">
                    <h5 style="color: #059669; font-size: 1rem; margin-bottom: 0.5rem;">Actually Join (${attendees.length})</h5>
                    <div class="attendance-list">
                        ${attendees.length === 0 ? '<div style="color: #9ca3af; font-style: italic;">No attendees yet</div>' : 
                          attendees.map(attendee => `
                            <div class="attendee-item" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0; border-bottom: 1px solid #a7f3d0;">
                                <div class="avatar" style="width: 2rem; height: 2rem; border-radius: 50%; background: linear-gradient(135deg, #10b981, #059669); display: flex; align-items: center; justify-content: center; color: white; font-size: 0.75rem; font-weight: 600;">${attendee.name.charAt(0)}</div>
                                <div>
                                    <div style="font-weight: 600; color: #374151; font-size: 1rem;">${attendee.name}</div>
                                    <div style="font-size: 0.75rem; color: #9ca3af;">Joined ${new Date(attendee.timestamp).toLocaleDateString()}</div>
                                </div>
                            </div>
                          `).join('')}
                    </div>
                    
                    ${this.currentUser ? `
                        <button onclick="window.calendar.toggleAttendance(${eventId})" class="attendance-btn" style="background: #10b981; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.375rem; cursor: pointer; margin-top: 0.5rem;">
                            ${attendees.find(a => a.id === this.currentUser.id) ? 'Remove Attendance' : 'Actually Join'}
                        </button>
                    ` : `
                        <div style="margin-top: 0.5rem;">
                            <div style="color: #6b7280; font-size: 0.875rem; margin-bottom: 0.5rem;">Register as colleague to mark attendance and add notes</div>
                            <button onclick="window.calendar.showColleagueModal()" style="background: #10b981; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.375rem; cursor: pointer;">
                                Register as Colleague
                            </button>
                        </div>
                    `}
                </div>
                
                <!-- Discussion Thread Section -->
                <div class="notes-section" style="margin-top: 1rem; padding: 1rem; background: #f8fafc; border-radius: 0.5rem; border: 1px solid #e2e8f0; margin-bottom: 1rem;">
                    <h5 style="color: #475569; font-size: 1rem; margin-bottom: 0.5rem;">Discussion Thread (${notes.length} posts)</h5>
                    <div class="notes-list" style="max-height: 300px; overflow-y: auto; border: 1px solid #e5e7eb; border-radius: 0.375rem; padding: 0.5rem; background: #f9fafb;">
                        ${notes.length === 0 ? '<div style="color: #9ca3af; font-style: italic; text-align: center; padding: 1rem;">No discussion yet. Start the conversation!</div>' :
                          notes.map(note => `
                            <div class="note-item" style="background: white; padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 0.5rem; border-left: 3px solid #4f46e5; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                                        <div class="avatar" style="width: 2rem; height: 2rem; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; color: white; font-size: 0.75rem; font-weight: 600;">${note.author.charAt(0)}</div>
                                        <div>
                                            <div style="font-weight: 600; color: #374151; font-size: 0.875rem;">${note.author}</div>
                                            <div style="font-size: 0.75rem; color: #9ca3af;">${new Date(note.timestamp).toLocaleString()}</div>
                                        </div>
                                    </div>
                                    ${this.currentUser && note.author === this.currentUser.name ? `
                                        <div style="display: flex; gap: 0.25rem;">
                                            <button onclick="window.calendar.editNote(${eventId}, '${note.id}')" style="background: #3b82f6; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.75rem;">Edit</button>
                                            <button onclick="window.calendar.deleteNote(${eventId}, '${note.id}')" style="background: #ef4444; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.75rem;">Delete</button>
                                        </div>
                                    ` : ''}
                                </div>
                                ${note.title ? `<div style="font-weight: 600; color: #1f2937; margin-bottom: 0.25rem;">${note.title}</div>` : ''}
                                <div style="color: #374151; line-height: 1.5; white-space: pre-wrap;">${note.content}</div>
                                ${note.edited ? '<div style="color: #9ca3af; font-size: 0.75rem; font-style: italic; margin-top: 0.25rem;">(edited)</div>' : ''}
                            </div>
                          `).join('')}
                    </div>
                    
                    ${this.currentUser ? `
                        <div class="add-note-section" style="margin-top: 1rem;">
                            <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <input type="text" id="noteTitle${eventId}" placeholder="Post title (optional)" style="flex: 1; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.875rem;">
                                <select id="noteType${eventId}" style="padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.875rem;">
                                    <option value="general">General</option>
                                    <option value="link">Link/Resource</option>
                                    <option value="question">Question</option>
                                    <option value="update">Update</option>
                                    <option value="insight">Insight</option>
                                </select>
                            </div>
                            <textarea id="newNote${eventId}" placeholder="Share information, ask questions, or add resources..." style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; resize: vertical; min-height: 80px;"></textarea>
                            <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                                <button onclick="window.calendar.addNote(${eventId})" style="background: #4f46e5; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.375rem; cursor: pointer;">
                                    Post Note
                                </button>
                                <button onclick="window.calendar.addLink(${eventId})" style="background: #10b981; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.375rem; cursor: pointer;">
                                    Share Link
                                </button>
                            </div>
                        </div>
                    ` : `
                        <div style="margin-top: 1rem; text-align: center; padding: 1.5rem; background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border: 2px solid #0ea5e9; border-radius: 0.5rem;">
                            <div style="font-size: 1.5rem; margin-bottom: 0.5rem;"></div>
                            <div style="font-weight: 600; color: #0c4a6e; margin-bottom: 0.5rem; font-size: 1rem;">Join the Discussion!</div>
                            <div style="color: #0c4a6e; font-size: 0.875rem; margin-bottom: 1rem;">Register as a colleague to participate in discussions, share resources, and collaborate with others.</div>
                            <button onclick="window.calendar.showColleagueModal()" style="background: #10b981; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; cursor: pointer; font-weight: 600; font-size: 1rem; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);">
                                Register as Colleague
                            </button>
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    toggleEventRegistration(eventId) {
        // If no current user, prompt for name
        if (!this.currentUser) {
            const name = prompt('Enter your name to register for this event:');
            if (!name || name.trim() === '') return;
            
            // Create colleague automatically
            const colleague = {
                id: Date.now(),
                name: name.trim(),
                registeredAt: new Date().toISOString()
            };
            
            this.colleagues.push(colleague);
            this.currentUser = colleague;
            this.saveColleagues();
        }
        
        if (!this.eventRegistrations[eventId]) {
            this.eventRegistrations[eventId] = [];
        }
        
        const existingIndex = this.eventRegistrations[eventId].findIndex(r => r.id === this.currentUser.id);
        
        if (existingIndex >= 0) {
            this.eventRegistrations[eventId].splice(existingIndex, 1);
            this.logCollaboration('event_unregistered', this.currentUser.name, `Unregistered from ${this.events.find(e => e.id === eventId).title}`);
        } else {
            this.eventRegistrations[eventId].push({
                id: this.currentUser.id,
                name: this.currentUser.name,
                timestamp: new Date().toISOString()
            });
            this.logCollaboration('event_registered', this.currentUser.name, `Registered for ${this.events.find(e => e.id === eventId).title}`);
        }
        
        this.saveCollaborationData();
        this.updateColleaguesList();
        this.addCollaborationFeatures(eventId);
        this.updateCollaborationActivity();
    }

    toggleInterest(eventId) {
        // If no current user, prompt for name
        if (!this.currentUser) {
            const name = prompt('Enter your name to express interest:');
            if (!name || name.trim() === '') return;
            
            // Create colleague automatically
            const colleague = {
                id: Date.now(),
                name: name.trim(),
                registeredAt: new Date().toISOString()
            };
            
            this.colleagues.push(colleague);
            this.currentUser = colleague;
            this.saveColleagues();
        }
        
        if (!this.interests[eventId]) {
            this.interests[eventId] = [];
        }
        
        const existingIndex = this.interests[eventId].findIndex(i => i.id === this.currentUser.id);
        
        if (existingIndex >= 0) {
            this.interests[eventId].splice(existingIndex, 1);
            this.logCollaboration('interest_removed', this.currentUser.name, `Removed interest for ${this.events.find(e => e.id === eventId).title}`);
        } else {
            this.interests[eventId].push({
                id: this.currentUser.id,
                name: this.currentUser.name,
                timestamp: new Date().toISOString()
            });
            this.logCollaboration('interest_added', this.currentUser.name, `Marked interest for ${this.events.find(e => e.id === eventId).title}`);
        }
        
        this.saveCollaborationData();
        this.updateColleaguesList();
        this.addCollaborationFeatures(eventId);
        this.updateCollaborationActivity();
    }

    toggleAttendance(eventId) {
        // If no current user, prompt for name
        if (!this.currentUser) {
            const name = prompt('Enter your name to mark attendance:');
            if (!name || name.trim() === '') return;
            
            // Create colleague automatically
            const colleague = {
                id: Date.now(),
                name: name.trim(),
                registeredAt: new Date().toISOString()
            };
            
            this.colleagues.push(colleague);
            this.currentUser = colleague;
            this.saveColleagues();
        }
        
        if (!this.attendance[eventId]) {
            this.attendance[eventId] = [];
        }
        
        const existingIndex = this.attendance[eventId].findIndex(a => a.id === this.currentUser.id);
        
        if (existingIndex >= 0) {
            this.attendance[eventId].splice(existingIndex, 1);
            this.logCollaboration('attendance_removed', this.currentUser.name, `Removed attendance for ${this.events.find(e => e.id === eventId).title}`);
        } else {
            this.attendance[eventId].push({
                id: this.currentUser.id,
                name: this.currentUser.name,
                timestamp: new Date().toISOString()
            });
            this.logCollaboration('attendance_added', this.currentUser.name, `Marked attendance for ${this.events.find(e => e.id === eventId).title}`);
        }
        
        this.saveCollaborationData();
        this.updateColleaguesList();
        this.addCollaborationFeatures(eventId);
        this.updateCollaborationActivity();
    }

    addNote(eventId) {
        // If no current user, prompt for name
        if (!this.currentUser) {
            const name = prompt('Enter your name to add a note:');
            if (!name || name.trim() === '') return;
            
            // Create colleague automatically
            const colleague = {
                id: Date.now(),
                name: name.trim(),
                registeredAt: new Date().toISOString()
            };
            
            this.colleagues.push(colleague);
            this.currentUser = colleague;
            this.saveColleagues();
        }
        
        const noteInput = document.getElementById(`newNote${eventId}`);
        const titleInput = document.getElementById(`noteTitle${eventId}`);
        const typeSelect = document.getElementById(`noteType${eventId}`);
        
        const content = noteInput.value.trim();
        const title = titleInput ? titleInput.value.trim() : '';
        const type = typeSelect ? typeSelect.value : 'general';
        
        if (!content) return;
        
        if (!this.eventNotes[eventId]) {
            this.eventNotes[eventId] = [];
        }
        
        const note = {
            id: Date.now().toString(),
            author: this.currentUser.name,
            title: title,
            content: content,
            type: type,
            timestamp: new Date().toISOString(),
            edited: false
        };
        
        this.eventNotes[eventId].push(note);
        this.saveCollaborationData();
        this.logCollaboration('note_added', this.currentUser.name, `Added ${type} note for ${this.events.find(e => e.id === eventId).title}`);
        
        noteInput.value = '';
        if (titleInput) titleInput.value = '';
        if (typeSelect) typeSelect.value = 'general';
        
        this.addCollaborationFeatures(eventId);
        this.updateCollaborationActivity();
    }

    addLink(eventId) {
        // If no current user, prompt for name
        if (!this.currentUser) {
            const name = prompt('Enter your name to share a link:');
            if (!name || name.trim() === '') return;
            
            // Create colleague automatically
            const colleague = {
                id: Date.now(),
                name: name.trim(),
                registeredAt: new Date().toISOString()
            };
            
            this.colleagues.push(colleague);
            this.currentUser = colleague;
            this.saveColleagues();
        }
        
        const noteInput = document.getElementById(`newNote${eventId}`);
        const titleInput = document.getElementById(`noteTitle${eventId}`);
        
        const content = noteInput.value.trim();
        const title = titleInput ? titleInput.value.trim() : 'Shared Link';
        
        if (!content) return;
        
        // Auto-detect if it's a URL
        const isUrl = content.match(/^https?:\/\/.+/);
        const linkContent = isUrl ? `Link: ${content}` : content;
        
        if (!this.eventNotes[eventId]) {
            this.eventNotes[eventId] = [];
        }
        
        const note = {
            id: Date.now().toString(),
            author: this.currentUser.name,
            title: title,
            content: linkContent,
            type: 'link',
            timestamp: new Date().toISOString(),
            edited: false
        };
        
        this.eventNotes[eventId].push(note);
        this.saveCollaborationData();
        this.logCollaboration('link_shared', this.currentUser.name, `Shared link for ${this.events.find(e => e.id === eventId).title}`);
        
        noteInput.value = '';
        if (titleInput) titleInput.value = '';
        
        this.addCollaborationFeatures(eventId);
        this.updateCollaborationActivity();
    }

    editNote(eventId, noteId) {
        const note = this.eventNotes[eventId]?.find(n => n.id === noteId);
        if (!note || !this.currentUser || note.author !== this.currentUser.name) return;
        
        const newContent = prompt('Edit your note:', note.content);
        if (newContent === null || newContent.trim() === '') return;
        
        note.content = newContent.trim();
        note.edited = true;
        note.lastEdited = new Date().toISOString();
        
        this.saveCollaborationData();
        this.logCollaboration('note_edited', this.currentUser.name, `Edited note in ${this.events.find(e => e.id === eventId).title}`);
        
        this.addCollaborationFeatures(eventId);
        this.updateCollaborationActivity();
    }

    deleteNote(eventId, noteId) {
        const note = this.eventNotes[eventId]?.find(n => n.id === noteId);
        if (!note || !this.currentUser || note.author !== this.currentUser.name) return;
        
        if (confirm('Are you sure you want to delete this note?')) {
            this.eventNotes[eventId] = this.eventNotes[eventId].filter(n => n.id !== noteId);
            this.saveCollaborationData();
            this.logCollaboration('note_deleted', this.currentUser.name, `Deleted note from ${this.events.find(e => e.id === eventId).title}`);
            
            this.addCollaborationFeatures(eventId);
            this.updateCollaborationActivity();
        }
    }

    logCollaboration(action, colleague, details) {
        const logEntry = {
            id: Date.now(),
            action: action,
            colleague: colleague,
            details: details,
            timestamp: new Date().toISOString()
        };
        
        if (!this.collaborationLog[action]) {
            this.collaborationLog[action] = [];
        }
        this.collaborationLog[action].push(logEntry);
        
        this.saveCollaborationData();
    }

    updateCollaborationActivity() {
        const container = document.getElementById('collaborationActivity');
        const recentActivity = [];
        
        Object.values(this.collaborationLog).flat().forEach(entry => {
            recentActivity.push(entry);
        });
        
        recentActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        if (recentActivity.length === 0) {
            container.innerHTML = '<div style="color: #9ca3af; font-style: italic;">No recent activity</div>';
            return;
        }
        
        container.innerHTML = recentActivity.slice(0, 5).map(entry => `
            <div style="padding: 0.5rem; border-bottom: 1px solid #e5e7eb; font-size: 0.875rem;">
                <div style="font-weight: 600; color: #374151;">${entry.colleague}</div>
                <div style="color: #6b7280;">${entry.details}</div>
                <div style="font-size: 0.75rem; color: #9ca3af;">${new Date(entry.timestamp).toLocaleDateString()}</div>
            </div>
        `).join('');
    }
    // Collaboration Methods
    showCollaborationFeatures(eventId) {
        const footer = document.getElementById('collaborationFooter');
        footer.style.display = 'block';
        
        const attendees = this.attendance[eventId] || [];
        
        footer.innerHTML = `
            <div class="collaboration-section">
                <h4>Event Attendance</h4>
                <div class="attendance-section" style="padding: 1rem; background: #f0fdf4; border-radius: 0.5rem; border: 1px solid #10b981; margin-bottom: 1rem;">
                    <h5 style="color: #059669; font-size: 1rem; margin-bottom: 0.5rem;">Who's Attending (${attendees.length})</h5>
                    <div class="attendance-list">
                        ${attendees.length === 0 ? '<div style="color: #9ca3af; font-style: italic;">No attendees yet</div>' : 
                          attendees.map(user => `
                            <div class="user-item" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0; border-bottom: 1px solid #a7f3d0;">
                                <div class="avatar" style="width: 2rem; height: 2rem; border-radius: 50%; background: linear-gradient(135deg, #10b981, #059669); display: flex; align-items: center; justify-content: center; color: white; font-size: 0.75rem; font-weight: 600;">${user.name.charAt(0)}</div>
                                <div>
                                    <div style="font-weight: 600; color: #374151; font-size: 1rem;">${user.name}</div>
                                </div>
                            </div>
                          `).join('')}
                    </div>
                    
                    <div style="margin-top: 0.5rem;">
                        <button onclick="window.calendar.joinEvent(${eventId})" style="background: #10b981; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.375rem; cursor: pointer;">
                            Join Event
                        </button>
                        <button onclick="window.calendar.leaveEvent(${eventId})" style="background: #ef4444; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.375rem; cursor: pointer; margin-left: 0.5rem;">
                            Leave Event
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    joinEvent(eventId) {
        const name = prompt('Enter your name to join this event:');
        if (!name || name.trim() === '') return;
        
        const userName = name.trim();
        
        if (!this.attendance[eventId]) {
            this.attendance[eventId] = [];
        }
        
        // Check if user already exists (by name)
        const existingIndex = this.attendance[eventId].findIndex(u => u.name === userName);
        
        if (existingIndex >= 0) {
            alert(`${userName} is already attending this event!`);
            return;
        }
        
        // Add user to attendance
        this.attendance[eventId].push({
            id: Date.now(),
            name: userName,
            timestamp: new Date().toISOString()
        });
        
        this.saveAttendanceData();
        this.showCollaborationFeatures(eventId);
    }

    leaveEvent(eventId) {
        const name = prompt('Enter your name to leave this event:');
        if (!name || name.trim() === '') return;
        
        const userName = name.trim();
        
        if (!this.attendance[eventId]) {
            this.attendance[eventId] = [];
        }
        
        // Find and remove user (by name)
        const existingIndex = this.attendance[eventId].findIndex(u => u.name === userName);
        
        if (existingIndex >= 0) {
            this.attendance[eventId].splice(existingIndex, 1);
            this.saveAttendanceData();
            this.showCollaborationFeatures(eventId);
        } else {
            alert(`${userName} is not attending this event.`);
        }
    }

    saveAttendanceData() {
        localStorage.setItem('calendar_attendance', JSON.stringify(this.attendance));
    }

    loadAttendanceData() {
        this.attendance = JSON.parse(localStorage.getItem('calendar_attendance')) || {};
    }
}

// Initialize calendar when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.calendar = new Calendar();
        console.log('EdTech Events Calendar V16 initialized');
});