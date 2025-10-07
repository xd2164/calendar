// Calendar Class for AI in EdTech Events
class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.events = [];
        this.discussions = {};
        this.currentView = 'month';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSampleData();
        this.render();
    }

    setupEventListeners() {
        // Navigation
        document.getElementById('prevBtn').addEventListener('click', () => this.navigate(-1));
        document.getElementById('nextBtn').addEventListener('click', () => this.navigate(1));
        document.getElementById('todayBtn').addEventListener('click', () => this.goToToday());

        // View toggles
        document.querySelectorAll('.btn-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.dataset.view;
                this.changeView(view);
            });
        });

        // Add event button
        document.getElementById('addEventBtn').addEventListener('click', () => this.showEventModal());
        document.getElementById('addHyperscalerEventBtn').addEventListener('click', () => this.showHyperscalerEventModal());

        // Modal controls
        document.getElementById('closeModal').addEventListener('click', () => this.hideEventModal());
        document.getElementById('closeDetailsModal').addEventListener('click', () => this.hideEventDetailsModal());
        document.getElementById('cancelEvent').addEventListener('click', () => this.hideEventModal());
        document.getElementById('eventForm').addEventListener('submit', (e) => this.handleEventSubmit(e));

        // Event type filter
        document.getElementById('eventTypeFilter').addEventListener('change', (e) => {
            this.render();
        });

        // Discussion form
        document.getElementById('messageForm').addEventListener('submit', (e) => this.handleMessageSubmit(e));
    }

    navigate(direction) {
        if (this.currentView === 'month') {
            this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        } else if (this.currentView === 'week') {
            this.currentDate.setDate(this.currentDate.getDate() + (direction * 7));
        } else if (this.currentView === 'day') {
            this.currentDate.setDate(this.currentDate.getDate() + direction);
        }
        this.render();
    }

    goToToday() {
        this.currentDate = new Date();
        this.render();
    }

    changeView(view) {
        this.currentView = view;
        document.querySelectorAll('.btn-toggle').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        this.render();
    }

    render() {
        this.updateHeader();
        this.renderCalendar();
        this.updateSidebar();
    }

    updateHeader() {
        const options = { year: 'numeric', month: 'long' };
        const monthYear = this.currentDate.toLocaleDateString('en-US', options);
        document.querySelector('.month-year').textContent = monthYear;
    }

    renderCalendar() {
        const calendarGrid = document.querySelector('.calendar-grid');
        
        if (this.currentView === 'month') {
            this.renderMonthView(calendarGrid);
        } else if (this.currentView === 'week') {
            this.renderWeekView(calendarGrid);
        } else if (this.currentView === 'day') {
            this.renderDayView(calendarGrid);
        }
    }

    renderMonthView(container) {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        container.innerHTML = `
            <div class="day-header">${days[0]}</div>
            <div class="day-header">${days[1]}</div>
            <div class="day-header">${days[2]}</div>
            <div class="day-header">${days[3]}</div>
            <div class="day-header">${days[4]}</div>
            <div class="day-header">${days[5]}</div>
            <div class="day-header">${days[6]}</div>
        `;
        
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dayElement = this.createDayElement(date, month);
            container.appendChild(dayElement);
        }
    }

    renderWeekView(container) {
        const startOfWeek = new Date(this.currentDate);
        const day = startOfWeek.getDay();
        startOfWeek.setDate(startOfWeek.getDate() - day);
        
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        container.innerHTML = `
            <div class="day-header">${days[0]}</div>
            <div class="day-header">${days[1]}</div>
            <div class="day-header">${days[2]}</div>
            <div class="day-header">${days[3]}</div>
            <div class="day-header">${days[4]}</div>
            <div class="day-header">${days[5]}</div>
            <div class="day-header">${days[6]}</div>
        `;
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            const dayElement = this.createDayElement(date, this.currentDate.getMonth());
            container.appendChild(dayElement);
        }
    }

    renderDayView(container) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayName = days[this.currentDate.getDay()];
        
        container.innerHTML = `
            <div class="day-header">${dayName}</div>
            <div class="day-header">${dayName}</div>
            <div class="day-header">${dayName}</div>
            <div class="day-header">${dayName}</div>
            <div class="day-header">${dayName}</div>
            <div class="day-header">${dayName}</div>
            <div class="day-header">${dayName}</div>
        `;
        
        for (let i = 0; i < 7; i++) {
            const dayElement = this.createDayElement(this.currentDate, this.currentDate.getMonth());
            container.appendChild(dayElement);
        }
    }

    createDayElement(date, currentMonth) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        if (date.getMonth() !== currentMonth) {
            dayElement.classList.add('other-month');
        }
        
        const today = new Date();
        if (this.isSameDay(date, today)) {
            dayElement.classList.add('today');
        }
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = date.getDate();
        dayElement.appendChild(dayNumber);
        
        const eventsContainer = document.createElement('div');
        eventsContainer.className = 'day-events';
        
        const dayEvents = this.getEventsForDate(date);
        const filterType = document.getElementById('eventTypeFilter').value;
        const filteredEvents = filterType === 'all' ? dayEvents : dayEvents.filter(event => event.type === filterType);
        
        if (filteredEvents.length > 0) {
            filteredEvents.slice(0, 3).forEach(event => {
                const eventDot = document.createElement('div');
                eventDot.className = 'event-dot';
                eventDot.style.background = this.getEventColor(event);
                eventDot.style.cursor = 'pointer';
                
                // Add event title
                const titleSpan = document.createElement('span');
                titleSpan.textContent = event.title;
                titleSpan.style.flex = '1';
                titleSpan.style.overflow = 'hidden';
                titleSpan.style.textOverflow = 'ellipsis';
                titleSpan.style.whiteSpace = 'nowrap';
                
                eventDot.appendChild(titleSpan);
                
                eventDot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showEventDetails(event);
                });
                
                eventsContainer.appendChild(eventDot);
            });
            
            if (filteredEvents.length > 3) {
                const moreEvents = document.createElement('div');
                moreEvents.className = 'event-dot';
                moreEvents.textContent = `+${filteredEvents.length - 3} more`;
                moreEvents.style.background = '#64748b';
                eventsContainer.appendChild(moreEvents);
            }
        }
        
        dayElement.appendChild(eventsContainer);
        
        dayElement.addEventListener('click', () => {
            this.selectedDate = date;
            this.showEventModal();
        });
        
        return dayElement;
    }

    updateSidebar() {
        this.updateTodayEvents();
        this.updateHyperscalerStats();
        this.updateUpcomingEvents();
        this.updateRecentEvents();
    }

    updateTodayEvents() {
        const todayEvents = this.getEventsForDate(new Date());
        const todayEventsContainer = document.getElementById('todayEvents');
        
        if (todayEvents.length === 0) {
            todayEventsContainer.innerHTML = '<div style="color: #64748b; font-style: italic;">No events today</div>';
            return;
        }

        todayEventsContainer.innerHTML = todayEvents.map(event => `
            <div class="event-item" onclick="calendar.showEventDetails(event)">
                <div class="event-title">${event.title}</div>
                <div class="event-time">${this.formatEventDate(event)}</div>
            </div>
        `).join('');
    }

    updateHyperscalerStats() {
        const tutoringCount = this.events.filter(event => event.type === 'tutoring').length;
        const navigationCount = this.events.filter(event => event.type === 'navigation').length;
        const mobilityCount = this.events.filter(event => event.type === 'mobility').length;

        document.getElementById('tutoringCount').textContent = tutoringCount;
        document.getElementById('navigationCount').textContent = navigationCount;
        document.getElementById('mobilityCount').textContent = mobilityCount;
    }

    updateUpcomingEvents() {
        const upcomingEvents = this.getUpcomingEvents().slice(0, 5);
        const upcomingContainer = document.getElementById('upcomingEvents');
        
        if (upcomingEvents.length === 0) {
            upcomingContainer.innerHTML = '<div style="color: #64748b; font-style: italic;">No upcoming events</div>';
            return;
        }

        upcomingContainer.innerHTML = upcomingEvents.map(event => `
            <div class="event-item" onclick="calendar.showEventDetails(event)">
                <div class="event-title">${event.title}</div>
                <div class="event-date">${this.formatEventDate(event)}</div>
            </div>
        `).join('');
    }

    updateRecentEvents() {
        const recentEvents = this.events
            .filter(event => new Date(event.date) < new Date())
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
        const recentContainer = document.getElementById('recentEvents');
        
        if (recentEvents.length === 0) {
            recentContainer.innerHTML = '<div style="color: #64748b; font-style: italic;">No recent events</div>';
            return;
        }

        recentContainer.innerHTML = recentEvents.map(event => `
            <div class="event-item" onclick="calendar.showEventDetails(event)">
                <div class="event-title">${event.title}</div>
                <div class="event-date">${this.formatEventDate(event)}</div>
            </div>
        `).join('');
    }

    showEventModal() {
        document.getElementById('eventModal').style.display = 'flex';
        document.getElementById('modalTitle').textContent = 'Add New Event';
        document.getElementById('eventForm').reset();
        document.getElementById('eventDate').value = this.selectedDate ? this.formatDateForInput(this.selectedDate) : '';
    }

    showHyperscalerEventModal() {
        document.getElementById('eventModal').style.display = 'flex';
        document.getElementById('modalTitle').textContent = 'Add Conference';
        document.getElementById('eventForm').reset();
        document.getElementById('eventDate').value = this.selectedDate ? this.formatDateForInput(this.selectedDate) : '';
    }

    hideEventModal() {
        document.getElementById('eventModal').style.display = 'none';
        this.selectedDate = null;
    }

    handleEventSubmit(e) {
        e.preventDefault();
        
        const event = {
            id: Date.now(),
            title: document.getElementById('eventTitle').value,
            type: document.getElementById('eventType').value,
            date: document.getElementById('eventDate').value,
            time: document.getElementById('eventTime').value,
            location: document.getElementById('eventLocation').value,
            description: document.getElementById('eventDescription').value,
            participants: document.getElementById('eventParticipants').value,
            notesLink: document.getElementById('eventNotesLink').value,
            color: document.getElementById('eventColor').value,
            created: new Date().toISOString()
        };

        this.events.push(event);
        this.saveEvents();
        this.render();
        this.hideEventModal();
    }

    showEventDetails(event) {
        const modal = document.getElementById('eventDetailsModal');
        document.getElementById('eventDetailsTitle').textContent = event.title;
        
        const detailsContent = `
            <div class="event-details">
                <div class="detail-row">
                    <strong>Date:</strong> ${this.formatEventDate(event)}
                </div>
                <div class="detail-row">
                    <strong>Category:</strong> ${this.formatEventType(event.type)}
                </div>
                ${event.location ? `<div class="detail-row"><strong>Location:</strong> ${event.location}</div>` : ''}
                ${event.participants ? `<div class="detail-row"><strong>Attending Colleagues:</strong> ${event.participants}</div>` : ''}
                ${event.description ? `<div class="detail-row"><strong>Description:</strong> ${event.description}</div>` : ''}
                ${event.notesLink ? `<div class="detail-row"><strong>Notes Link:</strong> <a href="${event.notesLink}" target="_blank">View Notes</a></div>` : ''}
            </div>
            <div class="discussion-section">
                <h3>Discussion</h3>
                <div class="discussion-thread" id="discussionThread">
                    ${this.getDiscussionsForEvent(event.id).map(msg => `
                        <div class="discussion-message">
                            <div class="message-author">${msg.author}</div>
                            <div class="message-text">${msg.text}</div>
                            <div class="message-time">${new Date(msg.timestamp).toLocaleString()}</div>
                        </div>
                    `).join('')}
                </div>
                <form class="discussion-input" id="messageForm">
                    <input type="text" id="messageText" placeholder="Add a comment..." required>
                    <input type="text" id="messageAuthor" placeholder="Your name" required>
                    <button type="submit">Post</button>
                </form>
            </div>
        `;
        
        modal.querySelector('.modal-body').innerHTML = detailsContent;
        modal.style.display = 'flex';
        
        // Re-setup the message form
        document.getElementById('messageForm').addEventListener('submit', (e) => this.handleMessageSubmit(e));
        this.currentEventId = event.id;
    }

    hideEventDetailsModal() {
        document.getElementById('eventDetailsModal').style.display = 'none';
        this.currentEventId = null;
    }

    handleMessageSubmit(e) {
        e.preventDefault();
        
        const text = document.getElementById('messageText').value;
        const author = document.getElementById('messageAuthor').value;
        
        if (!this.discussions[this.currentEventId]) {
            this.discussions[this.currentEventId] = [];
        }
        
        this.discussions[this.currentEventId].push({
            text,
            author,
            timestamp: new Date().toISOString()
        });
        
        this.saveDiscussions();
        this.showEventDetails(this.events.find(e => e.id === this.currentEventId));
        
        document.getElementById('messageText').value = '';
        document.getElementById('messageAuthor').value = '';
    }

    getEventsForDate(date) {
        return this.events.filter(event => {
            const eventDate = new Date(event.date);
            return this.isSameDay(eventDate, date);
        });
    }

    getUpcomingEvents() {
        const today = new Date();
        return this.events
            .filter(event => new Date(event.date) >= today)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }

    formatDateForInput(date) {
        return date.toISOString().split('T')[0];
    }

    formatEventDate(event) {
        const date = new Date(event.date);
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        
        if (event.time) {
            return `${date.toLocaleDateString('en-US', options)} at ${event.time}`;
        } else {
            return date.toLocaleDateString('en-US', options);
        }
    }

    getEventColor(event) {
        const typeColors = {
            'tutoring': '#3b82f6',
            'navigation': '#10b981',
            'mobility': '#f59e0b'
        };
        
        return typeColors[event.type] || event.color || '#3b82f6';
    }

    formatEventType(type) {
        const typeLabels = {
            'tutoring': 'Tutoring & Learning Instruction',
            'navigation': 'Navigation & Advising',
            'mobility': 'Learner Mobility'
        };
        return typeLabels[type] || type;
    }

    getDiscussionsForEvent(eventId) {
        return this.discussions[eventId] || [];
    }

    loadSampleData() {
        // Create events starting from October 2025 onwards
        const oct20 = new Date('2025-10-20');
        const nov01 = new Date('2025-11-01');
        const dec02 = new Date('2025-12-02');
        const dec03 = new Date('2025-12-03');
        const dec07 = new Date('2025-12-07');
        const jan11 = new Date('2026-01-11');
        const jan24 = new Date('2026-01-24');
        const feb13 = new Date('2026-02-13');
        const feb25 = new Date('2026-02-25');
        const mar27 = new Date('2026-03-27');
        const apr11 = new Date('2026-04-11');
        const apr16 = new Date('2026-04-16');
        const may15 = new Date('2026-05-15');
        const jun10 = new Date('2026-06-10');
        const jul08 = new Date('2026-07-08');
        const aug20 = new Date('2026-08-20');
        const sep12 = new Date('2026-09-12');
        const oct25 = new Date('2026-10-25');
        const nov15 = new Date('2026-11-15');
        const dec10 = new Date('2026-12-10');
        
        this.events = [
            // Tutoring & Learning Instruction Events
            {
                id: 1,
                title: 'AI for Educators Summit 2025',
                type: 'tutoring',
                date: this.formatDateForInput(oct20),
                time: '09:00',
                location: 'New York City, NY',
                description: 'One-day, hands-on experience designed to equip educators with practical strategies for integrating AI into teaching and learning. Features workshops and expert insights on AI-powered personalized learning systems. Highly relevant to Gates Foundation\'s educational equity initiatives.',
                participants: 'Dr. Sarah Chen, Dr. Michael Rodriguez',
                notesLink: '',
                color: '#3b82f6',
                created: new Date().toISOString()
            },
            {
                id: 2,
                title: 'Teaching with AI Program',
                type: 'tutoring',
                date: this.formatDateForInput(dec02),
                time: '14:00',
                location: 'Online',
                description: 'Online program tailored for higher education faculty and instructional designers, focusing on integrating AI into curricula to enhance student engagement and learning outcomes. Live sessions on December 2, 4, 9, and 11. Aligns with Gates Foundation\'s focus on evidence-based learning approaches.',
                participants: 'Dr. Lisa Park, Dr. James Wilson',
                notesLink: '',
                color: '#3b82f6',
                created: new Date().toISOString()
            },
            {
                id: 3,
                title: 'Future of Education Technology Conference (FETC) 2026',
                type: 'tutoring',
                date: this.formatDateForInput(jan11),
                time: '09:00',
                location: 'Orlando, FL',
                description: 'Major EdTech conference featuring AI-focused summits and workshops, including generative AI demonstrations and training sessions for educators. Showcases adaptive learning technologies and intelligent tutoring systems. Relevant to Gates Foundation\'s personalized learning initiatives.',
                participants: 'Dr. Ahmed Hassan, Dr. Fatima Al-Zahra',
                notesLink: '',
                color: '#3b82f6',
                created: new Date().toISOString()
            },
            {
                id: 4,
                title: 'EAAI-26 Symposium on Educational Advances in AI',
                type: 'tutoring',
                date: this.formatDateForInput(jan24),
                time: '10:00',
                location: 'Singapore',
                description: 'Venue for researchers and educators to discuss pedagogical issues and share resources related to teaching and using AI in education across various curricular levels. Focuses on AI tutoring systems and adaptive learning platforms. Addresses Gates Foundation\'s educational innovation priorities.',
                participants: 'Dr. Elena Rodriguez, Dr. Marcus Johnson',
                notesLink: '',
                color: '#3b82f6',
                created: new Date().toISOString()
            },
            {
                id: 5,
                title: 'Teaching Generation AI-Z: Learning & the Brain Conference',
                type: 'tutoring',
                date: this.formatDateForInput(feb13),
                time: '10:00',
                location: 'San Francisco, CA',
                description: 'Hybrid conference exploring generational neuroscience and AI\'s impact on attention and learning. Offers strategies to advance learning in an age of AI, distractions, and uncertainty. Aligns with Gates Foundation\'s focus on cognitive science and learning effectiveness.',
                participants: 'Dr. Alison Pendergast, Dr. Leah Belsky',
                notesLink: '',
                color: '#3b82f6',
                created: new Date().toISOString()
            },
            {
                id: 6,
                title: 'European Advanced Educational Technology Conference 2026',
                type: 'tutoring',
                date: this.formatDateForInput(mar27),
                time: '09:00',
                location: 'Oxford, UK',
                description: 'Academic conference exploring innovations in educational technology, including instructional design, e-learning, lifelong learning, and AI-enhanced learning systems. Features research on personalized learning and adaptive assessment tools. Relevant to Gates Foundation\'s global education initiatives.',
                participants: 'Dr. Rebecca Chen, Dr. Thomas Anderson',
                notesLink: '',
                color: '#3b82f6',
                created: new Date().toISOString()
            },
            {
                id: 7,
                title: 'ASU+GSV Summit & The AI Show 2026',
                type: 'tutoring',
                date: this.formatDateForInput(apr11),
                time: '09:00',
                location: 'San Diego, CA',
                description: 'Industry summit with dedicated AI Show, offering immersive exploration of AI\'s educational revolution, emerging trends, practical applications, and implementation strategies. Features language learning AI and career readiness technologies. Aligns with Gates Foundation\'s workforce development goals.',
                participants: 'Dr. Patricia Williams, Dr. Carlos Mendez',
                notesLink: '',
                color: '#3b82f6',
                created: new Date().toISOString()
            },
            {
                id: 8,
                title: 'AI in Higher Education Summit 2026',
                type: 'tutoring',
                date: this.formatDateForInput(may15),
                time: '10:00',
                location: 'Chicago, IL',
                description: 'Comprehensive summit on AI implementation in higher education, featuring adaptive learning systems, intelligent tutoring, and personalized education pathways. Showcases evidence-based approaches to improving learning outcomes. Aligns with Gates Foundation\'s postsecondary education goals.',
                participants: 'Dr. Sarah Chen, Dr. Michael Rodriguez',
                notesLink: '',
                color: '#3b82f6',
                created: new Date().toISOString()
            },
            {
                id: 9,
                title: 'Global AI Education Innovation Conference 2026',
                type: 'tutoring',
                date: this.formatDateForInput(aug20),
                time: '09:00',
                location: 'London, UK',
                description: 'Global conference showcasing AI innovations in education, featuring adaptive learning platforms, intelligent assessment systems, and personalized learning technologies. Includes workshops on implementation strategies and equity considerations. Relevant to Gates Foundation\'s global education initiatives.',
                participants: 'Dr. Elena Rodriguez, Dr. Marcus Johnson',
                notesLink: '',
                color: '#3b82f6',
                created: new Date().toISOString()
            },
            {
                id: 10,
                title: 'AI Tutoring & Adaptive Learning Research Conference 2026',
                type: 'tutoring',
                date: this.formatDateForInput(nov15),
                time: '09:00',
                location: 'Seattle, WA',
                description: 'Research conference on AI tutoring systems and adaptive learning technologies. Features latest research on personalized learning algorithms, intelligent tutoring systems, and learning analytics. Includes presentations on equity in AI education tools. Aligns with Gates Foundation\'s personalized learning and equity initiatives.',
                participants: 'Dr. Maria Gonzalez, Dr. Robert Kim',
                notesLink: '',
                color: '#3b82f6',
                created: new Date().toISOString()
            },
            // Navigation & Advising Events
            {
                id: 11,
                title: 'Innovative Schools Summit - San Antonio',
                type: 'navigation',
                date: this.formatDateForInput(dec03),
                time: '08:00',
                location: 'San Antonio, TX',
                description: 'Summit featuring multiple conferences including At-Risk Students Conference, Innovative Teaching Conference, and Innovative School Leadership. Focuses on AI-powered student navigation systems and advising tools for improving student outcomes. Highly relevant to Gates Foundation\'s college completion goals.',
                participants: 'Dr. Maria Gonzalez, Dr. Robert Kim',
                notesLink: '',
                color: '#10b981',
                created: new Date().toISOString()
            },
            {
                id: 12,
                title: 'Innovative Schools Summit - New York',
                type: 'navigation',
                date: this.formatDateForInput(feb25),
                time: '09:00',
                location: 'New York City, NY',
                description: 'Summit featuring conferences on At-Risk Students, Innovative Teaching, and Innovative School Leadership. Includes Wired Differently/Trauma-Informed Schools sessions with AI-powered student support systems. Addresses Gates Foundation\'s focus on student success and navigation.',
                participants: 'Dr. Jennifer Lee, Dr. David Thompson',
                notesLink: '',
                color: '#10b981',
                created: new Date().toISOString()
            },
            {
                id: 13,
                title: 'Student Success & AI Navigation Conference 2026',
                type: 'navigation',
                date: this.formatDateForInput(jun10),
                time: '09:00',
                location: 'Denver, CO',
                description: 'Conference focused on AI-powered student navigation and advising systems for improving college completion rates and student success outcomes. Features case studies on predictive analytics and intervention strategies. Highly relevant to Gates Foundation\'s college completion initiatives.',
                participants: 'Dr. Lisa Park, Dr. James Wilson',
                notesLink: '',
                color: '#10b981',
                created: new Date().toISOString()
            },
            {
                id: 14,
                title: 'AI-Powered Student Support Systems Workshop 2026',
                type: 'navigation',
                date: this.formatDateForInput(sep12),
                time: '14:00',
                location: 'Austin, TX',
                description: 'Hands-on workshop on implementing AI-powered student support systems, including predictive analytics for early intervention, automated advising tools, and personalized learning pathways. Features practical implementation strategies and case studies. Addresses Gates Foundation\'s student success priorities.',
                participants: 'Dr. Rebecca Chen, Dr. Thomas Anderson',
                notesLink: '',
                color: '#10b981',
                created: new Date().toISOString()
            },
            // Learner Mobility Events
            {
                id: 15,
                title: 'VSTE Conference 2025',
                type: 'mobility',
                date: this.formatDateForInput(dec07),
                time: '10:00',
                location: 'United States',
                description: 'Conference focusing on educational technology, offering networking opportunities, exhibitions, and sessions on various EdTech topics including digital credentials and learner pathway systems. Features discussions on credential portability and lifelong learning. Addresses Gates Foundation priorities around learner mobility.',
                participants: 'Dr. Sofia Martinez, Dr. James Wilson',
                notesLink: '',
                color: '#f59e0b',
                created: new Date().toISOString()
            },
            {
                id: 16,
                title: 'e-Learning & Innovative Pedagogies Conference - Human-Centered AI Transformations',
                type: 'mobility',
                date: this.formatDateForInput(apr16),
                time: '09:00',
                location: 'Rhodes, Greece & Virtual',
                description: 'International academic conference exploring human-centered AI in education, examining digital pedagogies, digital institutions, technologies of mediation, and designing social transformations. Focuses on flexible learning pathways and credential systems. Highly relevant to Gates Foundation\'s learner mobility initiatives.',
                participants: 'Dr. Amanda Foster, Dr. David Park',
                notesLink: '',
                color: '#f59e0b',
                created: new Date().toISOString()
            },
            {
                id: 17,
                title: 'Digital Credentials & Learning Pathways Summit 2026',
                type: 'mobility',
                date: this.formatDateForInput(jul08),
                time: '11:00',
                location: 'Toronto, Canada',
                description: 'Summit on creating flexible learning pathways and credential portability systems. Addresses AI-driven credential verification, micro-credentials, and lifelong learning pathways. Focuses on removing barriers to educational mobility. Aligns with Gates Foundation\'s learner mobility priorities.',
                participants: 'Dr. Ahmed Hassan, Dr. Fatima Al-Zahra',
                notesLink: '',
                color: '#f59e0b',
                created: new Date().toISOString()
            },
            {
                id: 18,
                title: 'Credential Transparency & AI Verification Summit 2026',
                type: 'mobility',
                date: this.formatDateForInput(oct25),
                time: '10:00',
                location: 'Washington, DC',
                description: 'Summit on AI-powered credential verification systems and transparent learning pathways. Features discussions on blockchain credentials, AI verification tools, and interoperability standards. Focuses on creating seamless learner mobility across institutions. Highly relevant to Gates Foundation\'s learner mobility goals.',
                participants: 'Dr. Patricia Williams, Dr. Carlos Mendez',
                notesLink: '',
                color: '#f59e0b',
                created: new Date().toISOString()
            },
            {
                id: 19,
                title: 'Future of Learning Pathways & AI Integration 2026',
                type: 'mobility',
                date: this.formatDateForInput(dec10),
                time: '11:00',
                location: 'Miami, FL',
                description: 'Conference on the future of learning pathways and AI integration in education. Features discussions on flexible credentialing, AI-driven career guidance, and lifelong learning systems. Showcases innovative approaches to removing educational barriers. Addresses Gates Foundation\'s comprehensive learner mobility strategy.',
                participants: 'Dr. Jennifer Lee, Dr. David Thompson',
                notesLink: '',
                color: '#f59e0b',
                created: new Date().toISOString()
            }
        ];
        
        this.saveEvents();
        this.render();
    }

    loadEvents() {
        const saved = localStorage.getItem('organizational-calendar-events');
        return saved ? JSON.parse(saved) : [];
    }

    saveEvents() {
        localStorage.setItem('organizational-calendar-events', JSON.stringify(this.events));
    }

    loadDiscussions() {
        const saved = localStorage.getItem('organizational-calendar-discussions');
        return saved ? JSON.parse(saved) : {};
    }

    saveDiscussions() {
        localStorage.setItem('organizational-calendar-discussions', JSON.stringify(this.discussions));
    }
}

// Initialize the calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const calendar = new Calendar();
    window.calendar = calendar; // Make it globally accessible for debugging
});
