// Organizational Event Calendar - JavaScript Functionality

class OrganizationalCalendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.events = this.loadEvents();
        this.currentView = 'month';
        this.currentFilter = 'all';
        this.discussions = this.loadDiscussions();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        // Clear existing events and load new partnership data
        this.clearEvents();
        this.loadSampleData();
        this.render();
    }

    setupEventListeners() {
        // Navigation buttons
        document.getElementById('prevBtn').addEventListener('click', () => this.navigate(-1));
        document.getElementById('nextBtn').addEventListener('click', () => this.navigate(1));
        document.getElementById('todayBtn').addEventListener('click', () => this.goToToday());

        // View toggle buttons
        document.querySelectorAll('.btn-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeView(e.target.dataset.view));
        });

        // Filter controls
        document.getElementById('eventTypeFilter').addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.render();
        });

        // Add event buttons
        document.getElementById('addEventBtn').addEventListener('click', () => this.showEventModal());
        document.getElementById('addHyperscalerEventBtn').addEventListener('click', () => this.showHyperscalerEventModal());

        // Modal controls
        document.getElementById('closeModal').addEventListener('click', () => this.hideEventModal());
        document.getElementById('cancelEvent').addEventListener('click', () => this.hideEventModal());
        document.getElementById('eventForm').addEventListener('submit', (e) => this.handleEventSubmit(e));

        // Event type change handler
        document.getElementById('eventType').addEventListener('change', (e) => {
            this.toggleHyperscalerProviderField(e.target.value);
        });

        // Event details modal
        document.getElementById('closeDetailsModal').addEventListener('click', () => this.hideEventDetailsModal());
        document.getElementById('sendMessage').addEventListener('click', () => this.sendMessage());

        // Close modals on outside click
        document.getElementById('eventModal').addEventListener('click', (e) => {
            if (e.target.id === 'eventModal') {
                this.hideEventModal();
            }
        });

        document.getElementById('eventDetailsModal').addEventListener('click', (e) => {
            if (e.target.id === 'eventDetailsModal') {
                this.hideEventDetailsModal();
            }
        });
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
        this.selectedDate = new Date();
        this.render();
    }

    changeView(view) {
        this.currentView = view;
        
        // Update active button
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
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        const monthYear = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        document.getElementById('monthYear').textContent = monthYear;
    }

    renderCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        calendarGrid.innerHTML = '';

        if (this.currentView === 'month') {
            this.renderMonthView();
        } else if (this.currentView === 'week') {
            this.renderWeekView();
        } else if (this.currentView === 'day') {
            this.renderDayView();
        }
    }

    renderMonthView() {
        const calendarGrid = document.getElementById('calendarGrid');
        
        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.textContent = day;
            dayHeader.style.cssText = `
                background: #f8fafc;
                padding: 1rem;
                text-align: center;
                font-weight: 600;
                color: #64748b;
                border-bottom: 1px solid #e2e8f0;
            `;
            calendarGrid.appendChild(dayHeader);
        });

        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dayElement = this.createDayElement(date);
            calendarGrid.appendChild(dayElement);
        }
    }

    renderWeekView() {
        const calendarGrid = document.getElementById('calendarGrid');
        
        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.textContent = day;
            dayHeader.style.cssText = `
                background: #f8fafc;
                padding: 1rem;
                text-align: center;
                font-weight: 600;
                color: #64748b;
                border-bottom: 1px solid #e2e8f0;
            `;
            calendarGrid.appendChild(dayHeader);
        });

        const startOfWeek = new Date(this.currentDate);
        startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay());

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            
            const dayElement = this.createDayElement(date);
            dayElement.style.minHeight = '150px';
            calendarGrid.appendChild(dayElement);
        }
    }

    renderDayView() {
        const calendarGrid = document.getElementById('calendarGrid');
        calendarGrid.style.gridTemplateColumns = '1fr';
        
        const dayElement = this.createDayElement(this.currentDate);
        dayElement.style.minHeight = '500px';
        calendarGrid.appendChild(dayElement);
    }

    createDayElement(date) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        const isCurrentMonth = date.getMonth() === this.currentDate.getMonth();
        const isToday = this.isSameDay(date, new Date());
        const isSelected = this.isSameDay(date, this.selectedDate);
        
        if (!isCurrentMonth) {
            dayElement.classList.add('other-month');
        }
        
        if (isToday) {
            dayElement.classList.add('today');
        }
        
        if (isSelected) {
            dayElement.style.background = '#dbeafe';
            dayElement.style.borderColor = '#3b82f6';
        }

        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = date.getDate();
        dayElement.appendChild(dayNumber);

        // Add events for this day
        const dayEvents = this.getEventsForDate(date);
        if (dayEvents.length > 0) {
            dayElement.classList.add('has-events');
            
            const eventsContainer = document.createElement('div');
            eventsContainer.className = 'day-events';
            
            dayEvents.slice(0, 3).forEach(event => {
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
            
            if (dayEvents.length > 3) {
                const moreEvents = document.createElement('div');
                moreEvents.className = 'event-dot';
                moreEvents.textContent = `+${dayEvents.length - 3} more`;
                moreEvents.style.background = '#64748b';
                eventsContainer.appendChild(moreEvents);
            }
            
            dayElement.appendChild(eventsContainer);
        }

        // Add click handler
        dayElement.addEventListener('click', () => {
            this.selectedDate = new Date(date);
            this.render();
        });

        return dayElement;
    }

    updateSidebar() {
        this.updateTodayEvents();
        this.updateHyperscalerStats();
        this.updateJointThemes();
        this.updateCollaborationActivities();
        this.updateUpcomingEvents();
    }

    updateTodayEvents() {
        const todayEvents = this.getEventsForDate(new Date());
        const todayEventsContainer = document.getElementById('todayEvents');
        
        if (todayEvents.length === 0) {
            todayEventsContainer.innerHTML = '<div style="color: #64748b; font-style: italic;">No events today</div>';
            return;
        }

        todayEventsContainer.innerHTML = todayEvents.map(event => `
            <div class="event-item" onclick="calendar.showEventDetails(${JSON.stringify(event).replace(/"/g, '&quot;')})">
                <div class="event-time">${event.time || 'All day'}</div>
                <div class="event-title">
                    <span class="event-type-indicator event-type-${event.type}"></span>
                    ${event.title}
                </div>
            </div>
        `).join('');
    }

    updateHyperscalerStats() {
        const hyperscalerEvents = this.events.filter(event => event.type === 'hyperscaler');
        const anthropicCount = hyperscalerEvents.filter(event => event.provider === 'anthropic').length;
        const openaiCount = hyperscalerEvents.filter(event => event.provider === 'openai').length;
        const googleCount = hyperscalerEvents.filter(event => event.provider === 'google').length;
        const microsoftCount = hyperscalerEvents.filter(event => event.provider === 'microsoft').length;
        const ai2Count = hyperscalerEvents.filter(event => event.provider === 'ai2').length;

        document.getElementById('anthropicCount').textContent = anthropicCount;
        document.getElementById('openaiCount').textContent = openaiCount;
        document.getElementById('googleCount').textContent = googleCount;
        document.getElementById('microsoftCount').textContent = microsoftCount;
        document.getElementById('ai2Count').textContent = ai2Count;
    }

    updateJointThemes() {
        const jointThemes = this.events.filter(event => event.type === 'joint-theme');
        const themesContainer = document.getElementById('jointThemes');
        
        if (jointThemes.length === 0) {
            themesContainer.innerHTML = '<div style="color: #64748b; font-style: italic;">No joint themes assigned</div>';
            return;
        }

        themesContainer.innerHTML = jointThemes.slice(0, 5).map(theme => `
            <div class="theme-item">
                <div class="theme-title">${theme.title}</div>
                <div class="theme-assignees">${theme.participants || 'No assignees'}</div>
            </div>
        `).join('');
    }

    updateCollaborationActivities() {
        const collaborationEvents = this.events.filter(event => event.type === 'collaboration');
        const activitiesContainer = document.getElementById('collaborationActivities');
        
        if (collaborationEvents.length === 0) {
            activitiesContainer.innerHTML = '<div style="color: #64748b; font-style: italic;">No active collaborations</div>';
            return;
        }

        activitiesContainer.innerHTML = collaborationEvents.slice(0, 5).map(activity => `
            <div class="event-item" onclick="calendar.showEventDetails(${JSON.stringify(activity).replace(/"/g, '&quot;')})">
                <div class="event-title">
                    <span class="event-type-indicator event-type-${activity.type}"></span>
                    ${activity.title}
                </div>
                <div class="event-time">${this.formatEventDate(activity.date)}</div>
            </div>
        `).join('');
    }

    updateUpcomingEvents() {
        const upcomingEvents = this.getUpcomingEvents();
        const upcomingEventsContainer = document.getElementById('upcomingEvents');
        
        if (upcomingEvents.length === 0) {
            upcomingEventsContainer.innerHTML = '<div style="color: #64748b; font-style: italic;">No upcoming events</div>';
            return;
        }

        upcomingEventsContainer.innerHTML = upcomingEvents.map(event => `
            <div class="event-item" onclick="calendar.showEventDetails(${JSON.stringify(event).replace(/"/g, '&quot;')})">
                <div class="event-date">${this.formatEventDate(event.date)}</div>
                <div class="event-title">
                    <span class="event-type-indicator event-type-${event.type}"></span>
                    ${event.title}
                </div>
            </div>
        `).join('');
    }

    showEventModal() {
        const modal = document.getElementById('eventModal');
        document.getElementById('modalTitle').textContent = 'Add New Session';
        modal.classList.add('show');
        
        // Set default date to selected date
        const eventDate = document.getElementById('eventDate');
        eventDate.value = this.formatDateForInput(this.selectedDate);
        
        // Reset form
        document.getElementById('eventForm').reset();
        eventDate.value = this.formatDateForInput(this.selectedDate);
    }

    showHyperscalerEventModal() {
        const modal = document.getElementById('eventModal');
        document.getElementById('modalTitle').textContent = 'Add Partnership Session';
        modal.classList.add('show');
        
        // Set event type to hyperscaler
        document.getElementById('eventType').value = 'hyperscaler';
        this.toggleHyperscalerProviderField('hyperscaler');
        
        // Set default date to selected date
        const eventDate = document.getElementById('eventDate');
        eventDate.value = this.formatDateForInput(this.selectedDate);
        
        // Reset form
        document.getElementById('eventForm').reset();
        document.getElementById('eventType').value = 'hyperscaler';
        this.toggleHyperscalerProviderField('hyperscaler');
        eventDate.value = this.formatDateForInput(this.selectedDate);
    }

    hideEventModal() {
        const modal = document.getElementById('eventModal');
        modal.classList.remove('show');
        
        // Reset form
        document.getElementById('eventForm').reset();
        document.getElementById('hyperscalerProviderGroup').style.display = 'none';
    }

    toggleHyperscalerProviderField(eventType) {
        const providerGroup = document.getElementById('hyperscalerProviderGroup');
        if (eventType === 'hyperscaler') {
            providerGroup.style.display = 'block';
        } else {
            providerGroup.style.display = 'none';
        }
    }

    handleEventSubmit(e) {
        e.preventDefault();
        
        const event = {
            id: Date.now(),
            title: document.getElementById('eventTitle').value,
            type: document.getElementById('eventType').value,
            date: document.getElementById('eventDate').value,
            time: document.getElementById('eventTime').value,
            description: document.getElementById('eventDescription').value,
            participants: document.getElementById('eventParticipants').value,
            color: document.getElementById('eventColor').value,
            provider: document.getElementById('eventType').value === 'hyperscaler' ? 
                     document.getElementById('hyperscalerProvider').value : null,
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
        
        const detailsContent = document.getElementById('eventDetailsContent');
        detailsContent.innerHTML = `
            <div class="event-details">
                <div class="detail-row">
                    <strong>Type:</strong> ${this.formatEventType(event.type)}
                </div>
                <div class="detail-row">
                    <strong>Date:</strong> ${this.formatEventDate(event.date)}
                </div>
                ${event.time ? `<div class="detail-row"><strong>Time:</strong> ${event.time}</div>` : ''}
                ${event.provider ? `<div class="detail-row"><strong>Provider:</strong> ${this.formatProvider(event.provider)}</div>` : ''}
                ${event.participants ? `<div class="detail-row"><strong>Participants:</strong> ${event.participants}</div>` : ''}
                ${event.description ? `<div class="detail-row"><strong>Description:</strong> ${event.description}</div>` : ''}
            </div>
        `;
        
        this.loadDiscussionThread(event.id);
        modal.classList.add('show');
        
        // Store current event for discussion
        this.currentEventId = event.id;
    }

    hideEventDetailsModal() {
        const modal = document.getElementById('eventDetailsModal');
        modal.classList.remove('show');
        this.currentEventId = null;
    }

    loadDiscussionThread(eventId) {
        const discussionThread = document.getElementById('discussionThread');
        const eventDiscussions = this.discussions[eventId] || [];
        
        if (eventDiscussions.length === 0) {
            discussionThread.innerHTML = '<div style="color: #64748b; font-style: italic;">No discussions yet</div>';
            return;
        }

        discussionThread.innerHTML = eventDiscussions.map(message => `
            <div class="discussion-message">
                <div class="message-author">${message.author}</div>
                <div class="message-text">${message.text}</div>
                <div class="message-time">${new Date(message.timestamp).toLocaleString()}</div>
            </div>
        `).join('');
    }

    sendMessage() {
        const messageInput = document.getElementById('newMessage');
        const messageText = messageInput.value.trim();
        
        if (!messageText || !this.currentEventId) return;
        
        const message = {
            author: 'You',
            text: messageText,
            timestamp: new Date().toISOString()
        };
        
        if (!this.discussions[this.currentEventId]) {
            this.discussions[this.currentEventId] = [];
        }
        
        this.discussions[this.currentEventId].push(message);
        this.saveDiscussions();
        
        messageInput.value = '';
        this.loadDiscussionThread(this.currentEventId);
    }

    getEventsForDate(date) {
        const dateString = this.formatDateForInput(date);
        let filteredEvents = this.events.filter(event => event.date === dateString);
        
        // Apply current filter
        if (this.currentFilter !== 'all') {
            filteredEvents = filteredEvents.filter(event => event.type === this.currentFilter);
        }
        
        return filteredEvents;
    }

    getUpcomingEvents() {
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        
        let upcomingEvents = this.events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= today && eventDate <= nextWeek;
        }).sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Apply current filter
        if (this.currentFilter !== 'all') {
            upcomingEvents = upcomingEvents.filter(event => event.type === this.currentFilter);
        }
        
        return upcomingEvents;
    }

    getEventColor(event) {
        if (event.type === 'hyperscaler') {
            const providerColors = {
                'aws': '#ff9900',
                'azure': '#0078d4',
                'gcp': '#4285f4',
                'anthropic': '#ff9900',
                'openai': '#0078d4',
                'microsoft': '#00a4ef',
                'google': '#4285f4',
                'ai2': '#ff6b35'
            };
            return providerColors[event.provider] || '#f59e0b';
        }
        
        const typeColors = {
            'joint-theme': '#8b5cf6',
            'collaboration': '#10b981',
            'internal': '#3b82f6'
        };
        
        return typeColors[event.type] || event.color || '#3b82f6';
    }

    formatEventType(type) {
        const typeLabels = {
            'hyperscaler': 'Partnership Session',
            'joint-theme': 'Joint Initiative',
            'collaboration': 'Collaboration Session',
            'internal': 'Internal Session'
        };
        return typeLabels[type] || type;
    }

    formatProvider(provider) {
        const providerLabels = {
            'aws': 'Amazon Web Services (AWS)',
            'azure': 'Microsoft Azure',
            'gcp': 'Google Cloud Platform (GCP)',
            'anthropic': 'Anthropic',
            'openai': 'OpenAI',
            'microsoft': 'Microsoft',
            'google': 'Google',
            'ai2': 'AI2'
        };
        return providerLabels[provider] || provider;
    }

    isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }

    formatDateForInput(date) {
        return date.toISOString().split('T')[0];
    }

    formatEventDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        if (this.isSameDay(date, today)) {
            return 'Today';
        } else if (this.isSameDay(date, tomorrow)) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'short',
                day: 'numeric'
            });
        }
    }

    loadSampleData() {
        if (this.events.length === 0) {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            const nextWeek = new Date(today);
            nextWeek.setDate(today.getDate() + 7);
            
            // Create dates for the partnership events
            const feb18 = new Date('2024-02-18');
            const feb26 = new Date('2024-02-26');
            const mar01 = new Date('2024-03-01');
            const mar03 = new Date('2024-03-03');
            const mar12 = new Date('2024-03-12');
            const may05 = new Date('2024-05-05');
            const may10 = new Date('2024-05-10');
            const jul01 = new Date('2024-07-01');
            const dec08 = new Date('2024-12-08');
            
            this.events = [
                // Anthropic Partnerships
            {
                id: 1,
                    title: 'Anthropic - K-12 Partnership Meeting',
                    type: 'hyperscaler',
                    provider: 'anthropic',
                    date: this.formatDateForInput(feb18),
                    time: '10:00',
                    description: 'Meeting with Bryan Richardson, K-12 team. Discussing datasets and benchmarks for AI capabilities specific to K-12 use cases.',
                    participants: 'Bryan Richardson, Neerav Kingsland, Social Impact Team',
                    color: '#ff9900',
                    created: new Date().toISOString()
            },
            {
                id: 2,
                    title: 'Anthropic - Higher Education Partnership',
                    type: 'hyperscaler',
                    provider: 'anthropic',
                    date: this.formatDateForInput(today),
                    time: '14:00',
                    description: 'Introduction to Complete College America (CCA) for potential convening to build AI-Readiness and capacity in member organizations.',
                    participants: 'Patrick Methvin, Steven Syverud, CCA representatives',
                    color: '#ff9900',
                    created: new Date().toISOString()
                },
                {
                    id: 3,
                    title: 'Anthropic - ASR Partnership Discussion',
                    type: 'hyperscaler',
                    provider: 'anthropic',
                    date: this.formatDateForInput(mar12),
                    time: '11:00',
                    description: 'Preparing to meet to discuss cofunding / shared objectives around open source data and ASR',
                    participants: 'Neerav Kingsland, EL Team',
                    color: '#ff9900',
                    created: new Date().toISOString()
                },
                
                // OpenAI Partnerships
                {
                    id: 4,
                    title: 'OpenAI - ASU AI Investment Discussion',
                    type: 'hyperscaler',
                    provider: 'openai',
                    date: this.formatDateForInput(mar03),
                    time: '15:00',
                    description: 'Intro from Lev Gonick at ASU related to AI investment. Initially exploratory conversation.',
                    participants: 'Alison Pendergast, Leah Belsky',
                    color: '#0078d4',
                    created: new Date().toISOString()
                },
                {
                    id: 5,
                    title: 'OpenAI - ASR Partnership Discussion',
                    type: 'hyperscaler',
                    provider: 'openai',
                    date: this.formatDateForInput(dec08),
                    time: '13:00',
                    description: 'Discussion about ASR functionality expansion. They did not have capacity to expand their ASR functionality in partnership.',
                    participants: 'Elli, Several OpenAI representatives',
                    color: '#0078d4',
                    created: new Date().toISOString()
                },
                {
                    id: 6,
                    title: 'OpenAI - Global Impact Meeting',
                    type: 'hyperscaler',
                    provider: 'openai',
                    date: this.formatDateForInput(feb26),
                    time: '16:00',
                    description: 'Navigation technology for the poor (e.g., "digital social worker"). Understanding OpenAI priorities relative to our team\'s work.',
                    participants: 'Clarence Wardell, Anna Makanju',
                    color: '#0078d4',
                    created: new Date().toISOString()
                },
                {
                    id: 7,
                    title: 'OpenAI - Global Affairs Meeting',
                    type: 'hyperscaler',
                    provider: 'openai',
                    date: this.formatDateForInput(jul01),
                    time: '14:30',
                    description: 'Global Affairs team meeting to discuss partnership opportunities and shared objectives.',
                    participants: 'Aras, Alex Nawar, Rebecca Distler',
                    color: '#0078d4',
                    created: new Date().toISOString()
                },
                
                // Google Partnerships
                {
                    id: 8,
                    title: 'Google - LearnLM Math Tutoring Partnership',
                    type: 'hyperscaler',
                    provider: 'google',
                    date: this.formatDateForInput(mar01),
                    time: '10:30',
                    description: 'Math Tutoring Benchmark collaboration. LearnLM team engagement for math model development and testing.',
                    participants: 'Lewis Leiboh, April Manos, Julia Wilkowski, Sara, Alyssa, DeepMind team',
                    color: '#4285f4',
                    created: new Date().toISOString()
                },
                {
                    id: 9,
                    title: 'Google - Human AI Interaction Research',
                    type: 'hyperscaler',
                    provider: 'google',
                    date: this.formatDateForInput(may10),
                    time: '15:30',
                    description: 'Human AI Interaction research collaboration. Human in the Loop methodology discussion.',
                    participants: 'Pavani Reddy, Dr. Meredith Morris',
                    color: '#4285f4',
                    created: new Date().toISOString()
                },
                
                // Microsoft Partnerships
                {
                    id: 10,
                    title: 'Microsoft - Phi-3.14 Math Tutoring Model',
                    type: 'hyperscaler',
                    provider: 'microsoft',
                    date: this.formatDateForInput(tomorrow),
                    time: '11:30',
                    description: 'Microsoft Research collaboration on Phi-3.14 Math Tutoring Small Language Model. Data contribution and public good development.',
                    participants: 'Lewis Leiboh, Denise Chen, Weishung Liu, Microsoft Research team',
                    color: '#00a4ef',
                    created: new Date().toISOString()
                },
                
                // AI2 Partnerships
                {
                    id: 11,
                    title: 'AI2 - Math Tutor Benchmark Collaboration',
                    type: 'hyperscaler',
                    provider: 'ai2',
                    date: this.formatDateForInput(feb18),
                    time: '13:30',
                    description: 'AI Math Tutor benchmark and other benchmarking work. Expertise in AI benchmarking brought to education.',
                    participants: 'Adam Goldfarb, Kyle Lo',
                    color: '#ff6b35',
                    created: new Date().toISOString()
                },
                {
                    id: 12,
                    title: 'AI2 - Advisory Role for ASR Competition',
                    type: 'hyperscaler',
                    provider: 'ai2',
                    date: this.formatDateForInput(mar12),
                    time: '16:00',
                    description: 'Requesting participation in paid advisory role for data science competition for ASR P-5',
                    participants: 'Elli, Marc Snyder, Kyle Lo, Danielle May',
                    color: '#ff6b35',
                    created: new Date().toISOString()
                },
                
                // Joint Themes
                {
                    id: 13,
                    title: 'K-12 AI Readiness Initiative',
                    type: 'joint-theme',
                    date: this.formatDateForInput(nextWeek),
                    time: '09:00',
                    description: 'Cross-functional initiative to improve AI readiness among K-12 institutions and organizations.',
                    participants: 'Bryan Richardson, Lewis Leiboh, Adam Goldfarb, K-12 Team',
                    color: '#8b5cf6',
                    created: new Date().toISOString()
                },
                {
                    id: 14,
                    title: 'Higher Education AI Capacity Building',
                    type: 'joint-theme',
                    date: this.formatDateForInput(nextWeek),
                time: '14:00',
                    description: 'Building AI-Readiness and capacity in higher education member organizations through CCA partnership.',
                    participants: 'Patrick Methvin, Steven Syverud, Higher Education Team',
                    color: '#8b5cf6',
                    created: new Date().toISOString()
                },
                
                // Collaboration Activities
                {
                    id: 15,
                    title: 'PW Team Scenario Exploration',
                    type: 'collaboration',
                    date: this.formatDateForInput(may05),
                    time: '10:00',
                    description: 'Exploring how developers will approach advising/navigation use case. Comparing hyperscalers vs incumbents.',
                    participants: 'Maurice McCaulley, PW Team, Tyton Partners',
                    color: '#10b981',
                    created: new Date().toISOString()
                }
            ];
            
            this.saveEvents();
            this.render();
        }
    }

    loadEvents() {
        const saved = localStorage.getItem('organizational-calendar-events');
        return saved ? JSON.parse(saved) : [];
    }

    clearEvents() {
        localStorage.removeItem('organizational-calendar-events');
        this.events = [];
        this.render();
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

// Initialize calendar when DOM is loaded
let calendar;
document.addEventListener('DOMContentLoaded', () => {
    calendar = new OrganizationalCalendar();
});