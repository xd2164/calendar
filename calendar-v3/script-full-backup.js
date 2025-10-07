// Calendar V3 - Blank Template
class Calendar {
    constructor() {
        console.log('Calendar constructor called');
        this.currentDate = new Date();
        this.selectedDate = null;
        this.events = [];
        this.currentView = 'month';
        this.currentUser = 'Sarah Chen'; // Set to actual colleague name
        this.colleagues = [
            { id: 'user1', name: 'Sarah Chen', email: 'sarah@example.com', avatar: 'SC', department: 'EdTech Strategy' },
            { id: 'user2', name: 'Mike Johnson', email: 'mike@example.com', avatar: 'MJ', department: 'AI Research' },
            { id: 'user3', name: 'Lisa Wang', email: 'lisa@example.com', avatar: 'LW', department: 'Learning Analytics' },
            { id: 'user4', name: 'David Rodriguez', email: 'david@example.com', avatar: 'DR', department: 'Product Development' },
            { id: 'user5', name: 'Emily Brown', email: 'emily@example.com', avatar: 'EB', department: 'Partnerships' },
            { id: 'user6', name: 'Alex Thompson', email: 'alex@example.com', avatar: 'AT', department: 'Technical Implementation' },
            { id: 'user7', name: 'Maria Garcia', email: 'maria@example.com', avatar: 'MG', department: 'User Experience' }
        ];
        this.rsvps = {}; // eventId -> { userId: { status: 'attending'|'interested'|'not-attending', timestamp: Date, name: string } }
        this.eventNotes = {}; // eventId -> [{ author: string, content: string, timestamp: Date }]
        this.collaborationLog = {}; // eventId -> [{ action: string, colleague: string, timestamp: Date, details: string }]
        
        // Add some sample RSVP data for demonstration
        this.addSampleRSVPData();
        this.init();
    }

    init() {
        console.log('Calendar init called');
        this.setupEventListeners();
        this.loadEdTechEvents();
        this.loadAllEventNotes();
        this.loadRSVPs();
        this.loadCollaborationLog();
        
        // Initialize real API validation system
        this.initializeValidationSystem();
        
        // Debug: Check for invalid dates
        this.events.forEach((event, index) => {
            const date = new Date(event.date);
            if (isNaN(date.getTime())) {
                console.error(`Invalid date in event ${index}:`, event);
            }
        });
        
        this.render();
        this.updateColleagueActivity();
    }

    async initializeValidationSystem() {
        try {
            // Load the real API validation system
            if (typeof RealSearchAPI !== 'undefined' && typeof EventValidationAPI !== 'undefined') {
                this.searchAPI = new RealSearchAPI();
                this.validationAPI = new EventValidationAPI();
                
                console.log('✅ Real API validation system initialized');
                
                // Run validation on key events
                await this.validateKeyEvents();
            } else {
                console.log('⚠️ Real API validation system not available - using fallback validation');
            }
        } catch (error) {
            console.error('❌ Failed to initialize validation system:', error);
        }
    }

    async validateKeyEvents() {
        const keyEvents = this.events.filter(event => 
            event.priority === 'high' || 
            event.organization === 'EdTech Week' ||
            event.organization === 'ISTE' ||
            event.organization === 'FETC'
        );

        console.log(`🔍 Validating ${keyEvents.length} key events with real APIs...`);

        for (const event of keyEvents.slice(0, 3)) { // Limit to 3 for demo
            try {
                console.log(`\n📅 Validating: ${event.title}`);
                
                // Use real search API
                const searchResults = await this.searchAPI.searchEdTechEvent(event);
                
                // Use real validation API
                const validationResults = await this.validationAPI.validateEvent(event, searchResults);
                
                console.log(`✅ Validation complete for ${event.title}:`, {
                    overallScore: validationResults.overallScore,
                    websiteValid: validationResults.validations.website.isValid,
                    dateValid: validationResults.validations.date.isValidDate,
                    organizationKnown: validationResults.validations.organization.isKnown
                });

                // Update event with validated information if needed
                if (validationResults.overallScore > 0.8) {
                    console.log(`🎯 High confidence validation for ${event.title}`);
                } else if (validationResults.overallScore < 0.5) {
                    console.log(`⚠️ Low confidence validation for ${event.title} - may need manual review`);
                }

            } catch (error) {
                console.error(`❌ Validation failed for ${event.title}:`, error);
            }

            // Rate limiting to avoid API limits
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
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

        // Modal controls
        document.getElementById('closeModal').addEventListener('click', () => this.hideEventModal());
        document.getElementById('closeDetailsModal').addEventListener('click', () => this.hideEventDetailsModal());


        document.getElementById('cancelEvent').addEventListener('click', () => this.hideEventModal());
        document.getElementById('eventForm').addEventListener('submit', (e) => this.handleEventSubmit(e));

        // Events list filters
        document.getElementById('eventTypeFilter').addEventListener('change', () => this.updateEventsList());
        document.getElementById('priorityFilter').addEventListener('change', () => this.updateEventsList());
        document.getElementById('useCaseFilter').addEventListener('change', () => this.updateEventsList());
        document.getElementById('organizationFilter').addEventListener('change', () => this.updateEventsList());
        document.getElementById('technologyFilter').addEventListener('change', () => this.updateEventsList());
        document.getElementById('sortByFilter').addEventListener('change', () => this.updateEventsList());
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
        console.log('Rendering calendar with', this.events.length, 'events');
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
        
        console.log(`Processing day ${date.toDateString()}, found ${dayEvents.length} events`);
        
        if (dayEvents.length > 0) {
            console.log(`Creating event dots for ${date.toDateString()}`);
            dayEvents.slice(0, 3).forEach(event => {
                console.log(`Creating event dot for: ${event.title}`);
                const eventDot = document.createElement('div');
                eventDot.className = 'event-dot';
                eventDot.textContent = event.title;
                eventDot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    console.log('Event dot clicked for:', event.title);
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
        this.updateUpcomingEvents();
        this.updateEventsList();
    }

    updateTodayEvents() {
        const todayEvents = this.getEventsForDate(new Date());
        const todayEventsContainer = document.getElementById('todayEvents');
        
        if (todayEvents.length === 0) {
            todayEventsContainer.innerHTML = '<div style="color: #64748b; font-style: italic;">No events today</div>';
            return;
        }

        todayEventsContainer.innerHTML = todayEvents.map(event => `
            <div class="event-item" data-event-id="${event.id}" style="cursor: pointer;">
                <div class="event-title">${event.title || 'Untitled Event'}</div>
                <div class="event-time">${this.formatEventDate(event)}</div>
            </div>
        `).join('');

        // Add click event listeners to today's events
        todayEventsContainer.querySelectorAll('.event-item').forEach(item => {
            item.addEventListener('click', () => {
                const eventId = parseInt(item.dataset.eventId);
                const event = this.events.find(e => e.id === eventId);
                if (event) {
                    console.log('Today event clicked:', event.title);
                    this.showEventDetails(event);
                }
            });
        });
    }

    updateUpcomingEvents() {
        const upcomingEvents = this.getUpcomingEvents().slice(0, 5);
        const upcomingContainer = document.getElementById('upcomingEvents');
        
        if (upcomingEvents.length === 0) {
            upcomingContainer.innerHTML = '<div style="color: #64748b; font-style: italic;">No upcoming events</div>';
            return;
        }

        upcomingContainer.innerHTML = upcomingEvents.map(event => `
            <div class="event-item" data-event-id="${event.id}" style="cursor: pointer;">
                <div class="event-title">${event.title || 'Untitled Event'}</div>
                <div class="event-date">${this.formatEventDate(event)}</div>
            </div>
        `).join('');

        // Add click event listeners to upcoming events
        upcomingContainer.querySelectorAll('.event-item').forEach(item => {
            item.addEventListener('click', () => {
                const eventId = parseInt(item.dataset.eventId);
                const event = this.events.find(e => e.id === eventId);
                if (event) {
                    console.log('Upcoming event clicked:', event.title);
                    this.showEventDetails(event);
                }
            });
        });
    }

    updateEventsList() {
        const eventsListContainer = document.getElementById('eventsList');
        const typeFilter = document.getElementById('eventTypeFilter').value;
        const priorityFilter = document.getElementById('priorityFilter').value;
        const useCaseFilter = document.getElementById('useCaseFilter').value;
        const organizationFilter = document.getElementById('organizationFilter').value;
        const technologyFilter = document.getElementById('technologyFilter').value;
        const sortBy = document.getElementById('sortByFilter').value;
        
        // Filter events by type
        let filteredEvents = this.events;
        if (typeFilter !== 'all') {
            filteredEvents = filteredEvents.filter(event => event.type === typeFilter);
        }
        
        // Filter events by priority
        if (priorityFilter !== 'all') {
            filteredEvents = filteredEvents.filter(event => event.priority === priorityFilter);
        }
        
        // Filter events by use case
        if (useCaseFilter !== 'all') {
            filteredEvents = filteredEvents.filter(event => 
                event.useCases && event.useCases.includes(useCaseFilter)
            );
        }
        
        // Filter events by organization
        if (organizationFilter !== 'all') {
            filteredEvents = filteredEvents.filter(event => 
                event.organization === organizationFilter
            );
        }
        
        // Filter events by technology
        if (technologyFilter !== 'all') {
            filteredEvents = filteredEvents.filter(event => 
                event.technologies && event.technologies.some(tech => 
                    tech.toLowerCase().includes(technologyFilter.toLowerCase())
                )
            );
        }
        
        // Sort events
        filteredEvents.sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(a.date) - new Date(b.date);
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'organization':
                    return a.organization.localeCompare(b.organization);
                case 'type':
                    return a.type.localeCompare(b.type);
                case 'priority':
                    const priorityOrder = { 'high': 1, 'medium-high': 2, 'medium': 3, 'medium-low': 4, 'low': 5 };
                    return (priorityOrder[a.priority] || 6) - (priorityOrder[b.priority] || 6);
                default:
                    return 0;
            }
        });
        
        if (filteredEvents.length === 0) {
            eventsListContainer.innerHTML = '<div style="text-align: center; color: #64748b; font-style: italic; padding: 2rem;">No events found matching the selected criteria.</div>';
            return;
        }
        
        eventsListContainer.innerHTML = filteredEvents.map(event => `
            <div class="event-card" data-event-id="${event.id}">
                <div class="event-card-header">
                    <div>
                        <div class="event-title">${event.title}</div>
                        ${event.useCases ? `<div class="event-use-cases">${this.formatUseCases(event.useCases)}</div>` : ''}
                    </div>
                    <div class="event-badges">
                        ${event.priority ? `<span class="priority-badge ${event.priority}">${this.formatPriority(event.priority)}</span>` : ''}
                        <span class="event-type-badge ${event.type}">${this.formatEventType(event.type)}</span>
                    </div>
                </div>
                
                <div class="event-meta">
                    <div class="event-date">${this.formatEventDate(event)}</div>
                    <div class="event-organization">${event.organization}</div>
                    ${event.technologies ? `<div class="event-technologies"><strong>Technologies:</strong> ${this.formatTechnologies(event.technologies)}</div>` : ''}
                </div>
                
                <div class="event-description">
                    ${event.description}
                </div>
                
                ${event.website ? `
                    <a href="${event.website}" target="_blank" class="event-website" onclick="event.stopPropagation();">
                        Visit Conference Website
                    </a>
                ` : ''}
            </div>
        `).join('');

        // Add click event listeners to event cards
        eventsListContainer.querySelectorAll('.event-card').forEach(card => {
            card.addEventListener('click', () => {
                const eventId = parseInt(card.dataset.eventId);
                const event = this.events.find(e => e.id === eventId);
                if (event) {
                    console.log('Event card clicked:', event.title);
                    this.showEventDetails(event);
                }
            });
        });
    }

    showEventModal() {
        document.getElementById('eventModal').style.display = 'flex';
        document.getElementById('modalTitle').textContent = 'Add New Event';
        document.getElementById('eventForm').reset();
        document.getElementById('eventDate').value = this.selectedDate ? this.formatDateForInput(this.selectedDate) : '';
    }

    hideEventModal() {
        document.getElementById('eventModal').style.display = 'none';
        this.selectedDate = null;
    }

    async handleEventSubmit(e) {
        e.preventDefault();
        
        const event = {
            id: Date.now(),
            title: document.getElementById('eventTitle').value,
            date: document.getElementById('eventDate').value,
            time: document.getElementById('eventTime').value,
            description: document.getElementById('eventDescription').value,
            organization: document.getElementById('eventOrganization').value || '',
            type: document.getElementById('eventType').value || 'conference',
            website: document.getElementById('eventWebsite').value || '',
            priority: document.getElementById('eventPriority').value || 'medium',
            useCases: document.getElementById('eventUseCases').value ? 
                document.getElementById('eventUseCases').value.split(',').map(uc => uc.trim()).filter(uc => uc) : [],
            technologies: document.getElementById('eventTechnologies').value ? 
                document.getElementById('eventTechnologies').value.split(',').map(t => t.trim()).filter(t => t) : [],
            relevance: document.getElementById('eventRelevance').value || '',
            created: new Date().toISOString()
        };

        // Auto-fetch and enhance event information
        const enhancedEvent = await this.autoFetchEventDetails(event);
        
        this.events.push(enhancedEvent);
        this.saveEvents();
        this.render();
        this.hideEventModal();
        
        // Log collaboration activity - use a generic creator name since no specific user is selected
        this.logCollaborationActivity(enhancedEvent.id, 'event_created', 'Event Creator', `Created event: "${enhancedEvent.title}"`);
        this.saveCollaborationLog();
    }

    showEventDetails(event) {
        console.log('showEventDetails called with event:', event);
        
        // Skip showing popup for events with invalid data
        if (!event || !event.title || !event.date) {
            console.warn('Skipping popup for event with missing data:', event);
            return;
        }

        const modal = document.getElementById('eventDetailsModal');
        console.log('Modal element found:', modal);
        
        if (!modal) {
            console.error('Event details modal not found!');
            return;
        }
        
        const titleElement = document.getElementById('eventDetailsTitle');
        console.log('Title element found:', titleElement);
        
        if (titleElement) {
            titleElement.textContent = event.title;
        }
        
        // Safely format the date
        const formattedDate = this.formatEventDate(event);
        
        const detailsContent = `
            <div class="event-details">
                <div class="detail-row">
                    <strong>Date:</strong> ${formattedDate}
                </div>
                ${event.organization ? `<div class="detail-row"><strong>Organization:</strong> ${event.organization}</div>` : ''}
                ${event.type ? `<div class="detail-row"><strong>Type:</strong> ${this.formatEventType(event.type)}</div>` : ''}
                ${event.priority ? `<div class="detail-row"><strong>Priority:</strong> <span class="priority-badge ${event.priority}">${this.formatPriority(event.priority)}</span></div>` : ''}
                ${event.useCases ? `<div class="detail-row"><strong>Use Cases:</strong> ${this.formatUseCases(event.useCases)}</div>` : ''}
                ${event.technologies ? `<div class="detail-row"><strong>Technologies:</strong> ${this.formatTechnologies(event.technologies)}</div>` : ''}
                ${event.relevance ? `<div class="detail-row"><strong>Relevance:</strong> ${event.relevance}</div>` : ''}
                ${event.website ? `<div class="detail-row"><strong>Website:</strong> <a href="${event.website}" target="_blank" style="color: #4f46e5; text-decoration: none;">Visit Conference Website →</a></div>` : ''}
                ${event.description ? `<div class="detail-row"><strong>Description:</strong> ${event.description}</div>` : ''}
            </div>
        `;
        
        const modalBody = modal.querySelector('.modal-body');
        console.log('Modal body found:', modalBody);
        
        if (modalBody) {
            modalBody.innerHTML = detailsContent;
        }
        
        // Setup collaborative features
        this.setupCollaborativeFeatures(event);
        
        console.log('Setting modal display to flex');
        modal.style.display = 'flex';
        console.log('Modal display set, current style:', modal.style.display);
        
        // Force show the modal with important CSS
        modal.style.setProperty('display', 'flex', 'important');
        modal.style.setProperty('visibility', 'visible', 'important');
        modal.style.setProperty('opacity', '1', 'important');
        console.log('Modal forced to show with important styles');
    }

    hideEventDetailsModal() {
        document.getElementById('eventDetailsModal').style.display = 'none';
    }

    getEventsForDate(date) {
        const dayEvents = this.events.filter(event => {
            const eventDate = new Date(event.date);
            return !isNaN(eventDate.getTime()) && this.isSameDay(eventDate, date);
        });
        
        if (dayEvents.length > 0) {
            console.log(`Found ${dayEvents.length} events for ${date.toDateString()}:`, dayEvents);
        }
        
        return dayEvents;
    }

    getUpcomingEvents() {
        const today = new Date();
        return this.events
            .filter(event => {
                const eventDate = new Date(event.date);
                return !isNaN(eventDate.getTime()) && eventDate >= today;
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    isSameDay(date1, date2) {
        const result = date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
        
        if (result) {
            console.log(`Dates match: ${date1.toDateString()} === ${date2.toDateString()}`);
        }
        
        return result;
    }

    formatDateForInput(date) {
        if (!date || isNaN(date.getTime())) {
            console.error('Invalid date passed to formatDateForInput:', date);
            return new Date().toISOString().split('T')[0]; // Return today's date as fallback
        }
        return date.toISOString().split('T')[0];
    }

    formatEventDate(event) {
        if (!event || !event.date) {
            return 'Date TBD';
        }
        
        const date = new Date(event.date);
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
            console.warn('Invalid date for event:', event.title, event.date);
            return 'Date TBD';
        }
        
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        
        try {
            const formattedDate = date.toLocaleDateString('en-US', options);
            if (event.time) {
                return `${formattedDate} at ${event.time}`;
            } else {
                return formattedDate;
            }
        } catch (error) {
            console.warn('Error formatting date for event:', event.title, error);
            return 'Date TBD';
        }
    }

    formatEventType(type) {
        const typeLabels = {
            'conference': 'Conference',
            'summit': 'Summit',
            'workshop': 'Workshop',
            'symposium': 'Symposium',
            'research': 'Research Conference',
            'training': 'Training Program'
        };
        return typeLabels[type] || type;
    }

    formatPriority(priority) {
        const priorityLabels = {
            'high': 'High Priority',
            'medium-high': 'Medium-High Priority',
            'medium': 'Medium Priority',
            'medium-low': 'Medium-Low Priority',
            'low': 'Low Priority'
        };
        return priorityLabels[priority] || priority;
    }

    formatUseCases(useCases) {
        const useCaseLabels = {
            'tutoring': 'Tutoring & Learning Instruction',
            'navigation': 'Navigation & Advising',
            'mobility': 'Learner Mobility'
        };
        return useCases.map(uc => useCaseLabels[uc] || uc).join(', ');
    }

    formatTechnologies(technologies) {
        return technologies.join(', ');
    }

    loadEdTechEvents() {
        console.log('Loading EdTech events...');
        // Comprehensive list of key EdTech events, organizations, and AI-related workshops
        const eventDates = {
            // Immediate Events (for visibility)
            today: new Date(),
            tomorrow: new Date(Date.now() + 24 * 60 * 60 * 1000),
            nextWeek: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            nextMonth: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            
            // 2025 Events
            oct08: new Date('2025-10-08'),
            oct13: new Date('2025-10-13'),
            oct20: new Date('2025-10-20'),
            nov01: new Date('2025-11-01'),
            nov15: new Date('2025-11-15'),
            nov17: new Date('2025-11-17'),
            dec01: new Date('2025-12-01'),
            dec02: new Date('2025-12-02'),
            dec03: new Date('2025-12-03'),
            dec07: new Date('2025-12-07'),
            dec15: new Date('2025-12-15'),
            
            // 2026 Events
            jan11: new Date('2026-01-11'),
            jan24: new Date('2026-01-24'),
            feb13: new Date('2026-02-13'),
            feb25: new Date('2026-02-25'),
            mar15: new Date('2026-03-15'),
            mar27: new Date('2026-03-27'),
            apr11: new Date('2026-04-11'),
            apr16: new Date('2026-04-16'),
            apr25: new Date('2026-04-25'),
            may05: new Date('2026-05-05'),
            may15: new Date('2026-05-15'),
            may30: new Date('2026-05-30'),
            jun10: new Date('2026-06-10'),
            jun20: new Date('2026-06-20'),
            jul08: new Date('2026-07-08'),
            jul18: new Date('2026-07-18'),
            aug05: new Date('2026-08-05'),
            aug20: new Date('2026-08-20'),
            sep12: new Date('2026-09-12'),
            sep28: new Date('2026-09-28'),
            oct10: new Date('2026-10-10'),
            oct25: new Date('2026-10-25'),
            nov05: new Date('2026-11-05'),
            nov15: new Date('2026-11-15'),
            dec10: new Date('2026-12-10'),
            
            // Additional 2026 Events
            feb18: new Date('2026-02-18'),
            mar08: new Date('2026-03-08'),
            mar22: new Date('2026-03-22'),
            apr02: new Date('2026-04-02'),
            apr18: new Date('2026-04-18'),
            may08: new Date('2026-05-08'),
            may22: new Date('2026-05-22'),
            jun05: new Date('2026-06-05'),
            jun25: new Date('2026-06-25'),
            jul22: new Date('2026-07-22'),
            aug12: new Date('2026-08-12'),
            aug28: new Date('2026-08-28'),
            sep05: new Date('2026-09-05'),
            oct02: new Date('2026-10-02'),
            oct18: new Date('2026-10-18'),
            nov08: new Date('2026-11-08'),
            nov22: new Date('2026-11-22'),
            dec05: new Date('2026-12-05'),
            dec20: new Date('2026-12-20'),
            oct1425: new Date('2025-10-14'),
            jan11: new Date('2026-01-11')
        };

        this.events = [
            // HYPERCALER EVENTS - Major cloud and AI providers
            {
                id: 27,
                title: 'Microsoft Ignite 2025',
                date: this.formatDateForInput(eventDates.nov17),
                time: '09:00',
                description: 'Microsoft\'s annual conference featuring major AI announcements including Copilot for Education, Azure AI services, and AI-driven applications for educational institutions. Showcases Microsoft\'s AI tools for personalized learning and student success.',
                organization: 'Microsoft',
                type: 'conference',
                website: 'https://ignite.microsoft.com/',
                priority: 'high',
                useCases: ['tutoring', 'navigation', 'mobility'],
                relevance: 'Microsoft\'s comprehensive AI education suite including Copilot, Azure AI, and learning analytics'
            },
            {
                id: 28,
                title: 'AWS re:Invent 2025',
                date: this.formatDateForInput(eventDates.dec01),
                time: '08:00',
                description: 'Amazon Web Services\' premier event unveiling innovations in AI, machine learning, and cloud-native tools. Features AWS AI services for educational institutions, including SageMaker, Bedrock, and AI-powered learning analytics.',
                organization: 'AWS',
                type: 'conference',
                website: 'https://reinvent.awsevents.com/',
                priority: 'high',
                useCases: ['tutoring', 'navigation', 'mobility'],
                relevance: 'AWS AI services and machine learning tools for educational technology and learning analytics'
            },
            {
                id: 29,
                title: 'Google Cloud Next 2026',
                date: this.formatDateForInput(eventDates.jan11),
                time: '09:00',
                description: 'Google\'s premier cloud conference showcasing AI innovations including Vertex AI, Gemini for Education, and Google Classroom AI features. Features sessions on AI-powered personalized learning and educational analytics.',
                organization: 'Google',
                type: 'conference',
                website: 'https://cloud.withgoogle.com/next/',
                priority: 'high',
                useCases: ['tutoring', 'navigation', 'mobility'],
                relevance: 'Google\'s AI education tools including Gemini, Classroom AI, and Vertex AI for educational applications'
            },
            {
                id: 30,
                title: 'OpenAI Developer Conference 2026',
                date: this.formatDateForInput(eventDates.feb13),
                time: '10:00',
                description: 'OpenAI\'s developer conference featuring latest GPT models, API updates, and AI applications in education. Includes workshops on building educational AI tools, content generation, and personalized tutoring systems.',
                organization: 'OpenAI',
                type: 'conference',
                website: 'https://openai.com/events/',
                priority: 'high',
                useCases: ['tutoring', 'navigation'],
                relevance: 'OpenAI\'s latest AI models and APIs for building educational tools and tutoring systems'
            },
            {
                id: 31,
                title: 'Anthropic AI Safety & Education Summit 2026',
                date: this.formatDateForInput(eventDates.mar27),
                time: '09:00',
                description: 'Anthropic\'s conference focusing on AI safety, alignment, and educational applications. Features Claude AI for education, constitutional AI principles, and responsible AI implementation in educational settings.',
                organization: 'Anthropic',
                type: 'conference',
                website: 'https://www.anthropic.com/events/',
                priority: 'medium-high',
                useCases: ['tutoring', 'navigation'],
                relevance: 'Anthropic\'s Claude AI and AI safety principles for educational applications'
            },
            {
                id: 32,
                title: 'Meta AI Education Workshop 2026',
                date: this.formatDateForInput(eventDates.apr11),
                time: '14:00',
                description: 'Meta\'s workshop on AI applications in education, featuring their AI research initiatives, virtual reality learning environments, and AI-powered educational content creation tools.',
                organization: 'Meta',
                type: 'workshop',
                website: 'https://ai.meta.com/events',
                priority: 'medium',
                useCases: ['tutoring', 'navigation'],
                relevance: 'Meta\'s AI research and VR/AR applications for immersive educational experiences'
            },
            {
                id: 33,
                title: 'Google I/O 2026',
                date: this.formatDateForInput(eventDates.may15),
                time: '10:00',
                description: 'Google\'s annual developer conference featuring latest AI announcements, Android AI features, and Google Workspace AI tools for education. Showcases AI-powered productivity tools and learning applications.',
                organization: 'Google',
                type: 'conference',
                website: 'https://events.google.com/io',
                priority: 'medium-high',
                useCases: ['tutoring', 'navigation'],
                relevance: 'Google\'s latest AI developments and Workspace AI tools for educational productivity'
            },
            {
                id: 34,
                title: 'AWS AI/ML Summit 2026',
                date: this.formatDateForInput(eventDates.jun10),
                time: '09:00',
                description: 'AWS dedicated AI/ML summit featuring deep dives into machine learning services, AI model training, and educational AI applications. Includes hands-on workshops on building AI-powered learning systems.',
                organization: 'AWS',
                type: 'conference',
                website: 'https://aws.amazon.com/events/summits',
                priority: 'medium-high',
                useCases: ['tutoring', 'navigation'],
                relevance: 'AWS machine learning services and AI model training for educational applications'
            },

            // EMERGING AI TECHNOLOGY EVENTS - Growing technologies and frameworks
            {
                id: 35,
                title: 'LangChain Developer Conference 2026',
                date: this.formatDateForInput(eventDates.mar15),
                time: '09:00',
                description: 'LangChain\'s premier developer conference featuring the latest in LLM application development, agent frameworks, and RAG implementations. Includes workshops on building educational AI agents and knowledge retrieval systems.',
                organization: 'LangChain',
                type: 'conference',
                website: 'https://python.langchain.com/docs/community/',
                priority: 'high',
                useCases: ['tutoring', 'navigation'],
                technologies: ['LangChain', 'LLM Applications', 'RAG', 'AI Agents'],
                relevance: 'Core framework for building educational AI applications with LLMs and agent systems'
            },
            {
                id: 36,
                title: 'ScaleAI Data & AI Conference 2026',
                date: this.formatDateForInput(eventDates.apr25),
                time: '10:00',
                description: 'ScaleAI\'s conference on data labeling, model training, and AI infrastructure for educational applications. Features sessions on creating high-quality training datasets for educational AI models and bias mitigation.',
                organization: 'ScaleAI',
                type: 'conference',
                website: 'https://scale.com/',
                priority: 'medium-high',
                useCases: ['tutoring', 'navigation'],
                technologies: ['ScaleAI', 'Data Labeling', 'Model Training', 'AI Infrastructure'],
                relevance: 'Data quality and model training infrastructure essential for educational AI applications'
            },
            {
                id: 37,
                title: 'Agentic AI Summit 2026',
                date: this.formatDateForInput(eventDates.may05),
                time: '09:00',
                description: 'Premier conference on autonomous AI agents and multi-agent systems for education. Features cutting-edge research on AI tutors, educational assistants, and autonomous learning systems.',
                organization: 'Agentic AI Institute',
                type: 'conference',
                website: 'https://www.aaai.org/',
                priority: 'high',
                useCases: ['tutoring', 'navigation'],
                technologies: ['Agentic AI', 'Autonomous Agents', 'Multi-Agent Systems', 'AI Tutors'],
                relevance: 'Next-generation AI agents for personalized tutoring and educational assistance'
            },
            {
                id: 38,
                title: 'Knowledge Graph & AI Conference 2026',
                date: this.formatDateForInput(eventDates.may30),
                time: '10:00',
                description: 'Conference on knowledge graphs, semantic AI, and structured knowledge for educational applications. Features sessions on building educational knowledge bases and AI reasoning systems.',
                organization: 'Knowledge Graph Foundation',
                type: 'conference',
                website: 'https://www.aaai.org/',
                priority: 'medium-high',
                useCases: ['tutoring', 'navigation', 'mobility'],
                technologies: ['Knowledge Graphs', 'Semantic AI', 'Structured Knowledge', 'AI Reasoning'],
                relevance: 'Knowledge graphs essential for intelligent tutoring systems and learning pathway navigation'
            },
            {
                id: 39,
                title: 'Model Context Protocol (MCP) Developer Summit 2026',
                date: this.formatDateForInput(eventDates.jun20),
                time: '09:00',
                description: 'First major conference on Model Context Protocol for AI model communication and context sharing. Features workshops on building educational AI systems with enhanced context awareness.',
                organization: 'MCP Consortium',
                type: 'conference',
                website: 'https://modelcontextprotocol.io/',
                priority: 'medium-high',
                useCases: ['tutoring', 'navigation'],
                technologies: ['Model Context Protocol', 'AI Context Sharing', 'Model Communication'],
                relevance: 'Emerging protocol for enhanced AI model communication in educational systems'
            },
            {
                id: 40,
                title: 'OpenAI DevDay 2026',
                date: this.formatDateForInput(eventDates.jul18),
                time: '10:00',
                description: 'OpenAI\'s annual developer conference featuring latest model releases, API updates, and AI safety research. Includes dedicated sessions on educational AI applications and responsible AI implementation.',
                organization: 'OpenAI',
                type: 'conference',
                website: 'https://openai.com/events/',
                priority: 'high',
                useCases: ['tutoring', 'navigation'],
                technologies: ['OpenAI', 'GPT Models', 'AI Safety', 'API Development'],
                relevance: 'Latest OpenAI models and APIs for building educational AI applications'
            },

            // COMPREHENSIVE EDTECH EVENTS - Practice, Research & Learning
            {
                id: 45,
                title: 'EdTech Week 2025',
                date: this.formatDateForInput(eventDates.oct20),
                time: '09:00',
                description: 'New York\'s #1 EdTech event at Columbia University featuring 200+ speakers including Leah Belsky, Thomas Bailey, Colin Kaepernick, and Claire Zau. Includes EdTech Week Expo, StartEd CEO Summit (invitation-only), Shark Tank pitch competitions with $250K+ in investments, and comprehensive programming for EdTech innovators.',
                organization: 'EdTech Week',
                type: 'conference',
                website: 'https://www.edtechweek.com/',
                priority: 'high',
                useCases: ['tutoring', 'navigation', 'mobility'],
                technologies: ['AI in Education', 'EdTech Innovation', 'Startup Investment', 'Educational Technology'],
                relevance: 'Premier EdTech event with 300+ investors, startup showcases, and comprehensive AI education programming'
            },
            {
                id: 46,
                title: 'EAAI Conference 2026',
                date: this.formatDateForInput(eventDates.mar08),
                time: '09:00',
                description: 'Educational Advances in Artificial Intelligence conference featuring cutting-edge research on AI tutoring systems, intelligent learning environments, and educational data mining. Academic conference with peer-reviewed papers and research presentations.',
                organization: 'EAAI',
                type: 'research',
                website: 'https://www.aaai.org/Conferences/AAAI/eaai.php',
                priority: 'high',
                useCases: ['tutoring', 'navigation'],
                technologies: ['AI Tutoring Systems', 'Intelligent Learning Environments', 'Educational Data Mining', 'Learning Analytics'],
                relevance: 'Leading academic conference on AI in education with cutting-edge research on tutoring systems and intelligent learning'
            },
            {
                id: 47,
                title: 'Workshop on Benchmarks for Human Flourishing with AI',
                date: this.formatDateForInput(eventDates.oct1425),
                time: '09:00',
                description: 'Collaborative workshop organized by MIT Media Lab\'s Advancing Humans with AI (AHA) research program. This action-oriented workshop focuses on developing rigorous assessment frameworks that measure how AI systems contribute to human flourishing across six key dimensions: Comprehension & Agency, Curiosity & Learning, Creativity & Expression, Physical & Mental Wellbeing, Healthy Social Lives, and Sense of Purpose. Features working group collaboration, tangible deliverables, and three methodological approaches: Interactive Human-AI Behavior Classification, Randomized Controlled Trials, and Human-AI Interaction Simulation.',
                organization: 'MIT Media Lab - AHA',
                type: 'workshop',
                website: 'https://www.media.mit.edu/events/aha-flourishing-workshop/',
                priority: 'high',
                useCases: ['tutoring', 'navigation', 'mobility'],
                technologies: ['AI Ethics', 'Human-AI Interaction', 'Educational Psychology', 'Wellbeing Technology', 'AI Benchmarks', 'Human Flourishing'],
                relevance: 'MIT Media Lab\'s cutting-edge research on measuring AI\'s impact on human flourishing with direct applications to educational AI systems and learning outcomes. Application deadline: August 1, 2025.'
            },
            {
                id: 48,
                title: 'Learning Analytics & Knowledge Conference 2026',
                date: this.formatDateForInput(eventDates.apr02),
                time: '09:00',
                description: 'International conference on learning analytics and educational data science. Features research on predictive analytics, learning dashboards, and data-driven insights for improving educational outcomes and student success.',
                organization: 'LAK',
                type: 'research',
                website: 'https://www.solaresearch.org/events/lak/',
                priority: 'high',
                useCases: ['navigation', 'tutoring'],
                technologies: ['Learning Analytics', 'Educational Data Science', 'Predictive Analytics', 'Learning Dashboards'],
                relevance: 'Core research conference on learning analytics and data-driven insights for educational improvement'
            },
            {
                id: 49,
                title: 'AIED Conference 2026',
                date: this.formatDateForInput(eventDates.apr18),
                time: '09:00',
                description: 'Artificial Intelligence in Education conference featuring international research on AI tutoring systems, intelligent learning environments, and adaptive learning technologies. Premier academic conference with peer-reviewed research.',
                organization: 'AIED',
                type: 'research',
                website: 'https://aied2024.org/',
                priority: 'high',
                useCases: ['tutoring', 'navigation'],
                technologies: ['AI Tutoring Systems', 'Intelligent Learning Environments', 'Adaptive Learning', 'Educational AI'],
                relevance: 'Premier international conference on AI in education with cutting-edge research on tutoring and adaptive learning systems'
            },
            {
                id: 50,
                title: 'EdTech Innovation Summit 2026',
                date: this.formatDateForInput(eventDates.may08),
                time: '09:00',
                description: 'Summit focused on innovative EdTech solutions, including AI-powered learning platforms, virtual reality in education, and next-generation learning management systems. Features startup showcases and innovation awards.',
                organization: 'EdTech Innovation Lab',
                type: 'summit',
                website: 'https://www.fetc.org/',
                priority: 'medium-high',
                useCases: ['tutoring', 'navigation', 'mobility'],
                technologies: ['AI Learning Platforms', 'Virtual Reality', 'Learning Management Systems', 'Educational Innovation'],
                relevance: 'Innovation-focused summit showcasing cutting-edge EdTech solutions and AI-powered learning platforms'
            },
            {
                id: 51,
                title: 'Personalized Learning Conference 2026',
                date: this.formatDateForInput(eventDates.may22),
                time: '10:00',
                description: 'Conference dedicated to personalized learning approaches, adaptive learning technologies, and individualized instruction methods. Features case studies, implementation strategies, and research on personalized learning effectiveness.',
                organization: 'Personalized Learning Consortium',
                type: 'conference',
                website: 'https://www.iste.org/',
                priority: 'high',
                useCases: ['tutoring', 'navigation'],
                technologies: ['Personalized Learning', 'Adaptive Learning', 'Individualized Instruction', 'Learning Pathways'],
                relevance: 'Direct focus on personalized learning approaches and adaptive technologies for individualized education'
            },
            {
                id: 52,
                title: 'Digital Learning Research Conference 2026',
                date: this.formatDateForInput(eventDates.jun05),
                time: '09:00',
                description: 'Research conference on digital learning technologies, online education effectiveness, and digital pedagogy. Features academic presentations on MOOCs, blended learning, and digital learning outcomes.',
                organization: 'Digital Learning Research Institute',
                type: 'research',
                website: 'https://onlinelearningconsortium.org/',
                priority: 'medium-high',
                useCases: ['tutoring', 'navigation', 'mobility'],
                technologies: ['Digital Learning', 'Online Education', 'Digital Pedagogy', 'Blended Learning'],
                relevance: 'Research-focused conference on digital learning technologies and online education effectiveness'
            },
            {
                id: 62,
                title: 'Future of Education Technology Conference 2026',
                date: this.formatDateForInput(eventDates.jan11),
                time: '09:00',
                description: 'Forward-looking conference on emerging technologies in education, including AI, VR/AR, blockchain, and next-generation learning platforms. Features technology previews and future trends analysis. Conference runs January 11-14, 2026.',
                organization: 'Future EdTech',
                type: 'conference',
                website: 'https://www.fetc.org/',
                priority: 'medium-high',
                useCases: ['tutoring', 'navigation', 'mobility'],
                technologies: ['Future Technologies', 'VR/AR', 'Blockchain', 'Next-Gen Learning Platforms'],
                relevance: 'Forward-looking conference on emerging technologies and future trends in education'
            },

            // HIGH PRIORITY - Direct relevance to core use cases
            {
                id: 1,
                title: 'AI for Educators Summit 2025',
                date: this.formatDateForInput(eventDates.oct20),
                time: '09:00',
                description: 'One-day, hands-on experience designed to equip educators with practical strategies for integrating AI into teaching and learning. Features workshops and expert insights on AI-powered personalized learning systems.',
                organization: 'AI Education Initiative',
                type: 'conference',
                website: 'https://www.iste.org/',
                priority: 'high',
                useCases: ['tutoring', 'navigation'],
                relevance: 'Direct focus on AI in teaching and learning with practical implementation strategies'
            },
            {
                id: 14,
                title: 'Student Success & AI Navigation Conference 2026',
                date: this.formatDateForInput(eventDates.jun10),
                time: '09:00',
                description: 'Conference focused on AI-powered student navigation and advising systems for improving college completion rates and student success outcomes.',
                organization: 'Student Success Institute',
                type: 'conference',
                website: 'https://www.studentsuccess.org/',
                priority: 'high',
                useCases: ['navigation'],
                relevance: 'Directly addresses AI-powered student navigation and advising systems'
            },

            // MEDIUM-HIGH PRIORITY - Strong relevance to multiple use cases
            {
                id: 2,
                title: 'Future of Education Technology Conference (FETC) 2026',
                date: this.formatDateForInput(eventDates.jan11),
                time: '09:00',
                description: 'Major EdTech conference featuring AI-focused summits and workshops, including generative AI demonstrations and training sessions for educators. Showcases adaptive learning technologies and intelligent tutoring systems.',
                organization: 'FETC',
                type: 'conference',
                website: 'https://www.fetc.org/',
                priority: 'medium-high',
                useCases: ['tutoring', 'navigation'],
                relevance: 'Major EdTech conference with AI focus, adaptive learning, and intelligent tutoring systems'
            },
            {
                id: 5,
                title: 'ISTE Conference & Expo 2026',
                date: this.formatDateForInput(eventDates.jun10),
                time: '09:00',
                description: 'International Society for Technology in Education conference with extensive AI in education tracks, hands-on workshops, and global networking.',
                organization: 'ISTE',
                type: 'conference',
                website: 'https://conference.iste.org/',
                priority: 'medium-high',
                useCases: ['tutoring', 'navigation'],
                relevance: 'Leading EdTech conference with extensive AI tracks and practical workshops'
            },

            // MEDIUM PRIORITY - Good relevance to specific use cases
            {
                id: 7,
                title: 'Teaching Generation AI-Z: Learning & the Brain Conference',
                date: this.formatDateForInput(eventDates.feb13),
                time: '10:00',
                description: 'Hybrid conference exploring generational neuroscience and AI\'s impact on attention and learning. Offers strategies to advance learning in an age of AI.',
                organization: 'Learning & the Brain Foundation',
                type: 'conference',
                website: 'https://www.learningandthebrain.com',
                priority: 'medium',
                useCases: ['tutoring'],
                relevance: 'Neuroscience-based approach to AI learning strategies relevant for tutoring applications'
            },
            {
                id: 12,
                title: 'Innovative Schools Summit - San Antonio',
                date: this.formatDateForInput(eventDates.dec03),
                time: '08:00',
                description: 'Summit featuring multiple conferences including At-Risk Students Conference and Innovative School Leadership. Focuses on AI-powered student navigation systems.',
                organization: 'Innovative Schools Network',
                type: 'summit',
                website: 'https://www.innovativeschoolssummit.org',
                priority: 'medium',
                useCases: ['navigation'],
                relevance: 'Focus on AI-powered student navigation systems and at-risk student support'
            },
            {
                id: 13,
                title: 'Innovative Schools Summit - New York',
                date: this.formatDateForInput(eventDates.feb25),
                time: '09:00',
                description: 'Summit featuring conferences on At-Risk Students and Innovative Teaching with AI-powered student support systems and trauma-informed approaches.',
                organization: 'Innovative Schools Network',
                type: 'summit',
                website: 'https://www.innovativeschoolssummit.org',
                priority: 'medium',
                useCases: ['navigation'],
                relevance: 'AI-powered student support systems with trauma-informed approaches'
            },
            {
                id: 24,
                title: 'AI Tools for Assessment & Feedback Workshop',
                date: this.formatDateForInput(eventDates.dec15),
                time: '13:00',
                description: 'Hands-on workshop exploring AI-powered assessment tools, automated feedback systems, and intelligent grading technologies.',
                organization: 'Assessment Innovation Lab',
                type: 'workshop',
                website: 'https://www.assessmentinnovation.org',
                priority: 'medium',
                useCases: ['tutoring'],
                relevance: 'AI assessment and feedback tools directly applicable to tutoring systems'
            },

            // MEDIUM-LOW PRIORITY - Some relevance but broader scope
            {
                id: 3,
                title: 'ASU+GSV Summit & The AI Show 2026',
                date: this.formatDateForInput(eventDates.apr11),
                time: '09:00',
                description: 'Industry summit with dedicated AI Show, offering immersive exploration of AI\'s educational revolution, emerging trends, practical applications, and implementation strategies.',
                organization: 'ASU+GSV',
                type: 'summit',
                website: 'https://www.asugsvsummit.com/',
                priority: 'medium-low',
                useCases: ['tutoring', 'navigation', 'mobility'],
                relevance: 'Broad industry perspective on AI in education with practical applications'
            }
        ];
        
        console.log('Events loaded:', this.events.length, 'events');
        console.log('First event:', this.events[0]);
        
        // Test date matching
        const today = new Date();
        const todayEvents = this.events.filter(event => {
            const eventDate = new Date(event.date);
            return this.isSameDay(eventDate, today);
        });
        console.log('Events for today:', todayEvents);
        
        this.saveEvents();
    }

    saveEvents() {
        localStorage.setItem('calendar-v3-events', JSON.stringify(this.events));
    }

    loadEvents() {
        const saved = localStorage.getItem('calendar-v3-events');
        if (saved) {
            this.events = JSON.parse(saved);
        }
    }
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.calendar = new Calendar();
});
