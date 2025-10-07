// EdTech Events Calendar V17 - localStorage Version
class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.events = [];
        // Using localStorage instead of backend API
        this.init();
    }

    init() {
        this.loadEvents();
        this.render();
        this.attachEventListeners();
        this.updateSidebar();
        console.log('EdTech Events Calendar V17 initialized with localStorage');
    }

    loadEvents() {
        // Load from localStorage with fallback to default events
        const saved = localStorage.getItem('calendarEventsV17');
        if (saved) {
            this.events = JSON.parse(saved);
            console.log('Events loaded from localStorage:', this.events);
        } else {
            this.events = this.getDefaultEvents();
            this.saveEvents(); // Save default events
        }
    }

    getDefaultEvents() {
        return [
            {
                id: 1,
                title: 'AWS re:Invent 2025',
                date: '2025-12-01',
                time: '09:00',
                description: 'AWS re:Invent 2025',
                organization: 'Amazon',
                website: 'https://reinvent.awsevents.com/',
                type: 'conference',
                priority: 'high',
                useCases: ['tutoring', 'navigation'],
                technologies: ['AI in Education', 'Learning Analytics'],
                relevance: 'High'
            },
            {
                id: 2,
                title: 'Google I/O 2025',
                date: '2025-05-14',
                time: '10:00',
                description: 'Google I/O 2025',
                organization: 'Google',
                website: 'https://io.google/2025/',
                type: 'conference',
                priority: 'high',
                useCases: ['tutoring', 'navigation'],
                technologies: ['AI in Education', 'Learning Analytics'],
                relevance: 'High'
            }
        ];
    }

    saveEvents() {
        localStorage.setItem('calendarEventsV17', JSON.stringify(this.events));
        console.log('Events saved to localStorage');
    }

    attachEventListeners() {
        // Add Event Modal
        document.getElementById('addEventBtn').addEventListener('click', () => this.showAddEventModal());
        document.getElementById('closeAddModal').addEventListener('click', () => this.hideAddEventModal());
        document.getElementById('cancelAddEvent').addEventListener('click', () => this.hideAddEventModal());
        document.getElementById('addEventForm').addEventListener('submit', (e) => this.handleEventSubmit(e));

        // Navigation
        document.getElementById('prevBtn').addEventListener('click', () => this.previousMonth());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextMonth());
        document.getElementById('todayBtn').addEventListener('click', () => this.goToToday());

        // Close modal when clicking outside
        document.getElementById('addEventModal').addEventListener('click', (e) => {
            if (e.target.id === 'addEventModal') {
                this.hideAddEventModal();
            }
        });
    }

    handleEventSubmit(e) {
        e.preventDefault();
        console.log('Form submitted!');
        
        const useCases = Array.from(document.querySelectorAll('input[name="useCases"]:checked')).map(cb => cb.value);
        const technologies = Array.from(document.querySelectorAll('input[name="technologies"]:checked')).map(cb => cb.value);
        
        console.log('Use cases:', useCases);
        console.log('Technologies:', technologies);
        
        const newEvent = {
            id: Date.now(), // Generate unique ID
            title: document.getElementById('eventTitle').value,
            date: document.getElementById('eventDate').value,
            time: '', // No time field
            description: document.getElementById('eventDescription').value,
            organization: document.getElementById('eventOrganization').value,
            website: document.getElementById('eventWebsite').value,
            type: document.getElementById('eventType').value,
            priority: document.getElementById('eventPriority').value,
            useCases: useCases,
            technologies: technologies,
            relevance: 'User-added event'
        };
        
        console.log('New event object:', newEvent);
        
        // Add to events array
        this.events.push(newEvent);
        console.log('Events array after push:', this.events);
        
        // Save to localStorage
        this.saveEvents();
        
        // Update display
        this.render();
        this.hideAddEventModal();
        
        console.log('Event added successfully!');
        alert('Event saved successfully!');
    }

    showAddEventModal() {
        document.getElementById('addEventModal').style.display = 'flex';
        document.getElementById('addEventForm').reset();
    }

    hideAddEventModal() {
        document.getElementById('addEventModal').style.display = 'none';
    }

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

    render() {
        this.renderCalendar();
        this.updateSidebar();
    }

    renderCalendar() {
        const calendar = document.getElementById('calendar');
        const monthYear = document.querySelector('.month-year');
        
        if (!calendar) {
            console.error('Calendar element not found!');
            return;
        }
        
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        monthYear.textContent = this.currentDate.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
        });

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        let calendarHTML = '';
        
        // Day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        calendarHTML += '<div class="calendar-header-row">';
        dayHeaders.forEach(day => {
            calendarHTML += `<div class="day-header">${day}</div>`;
        });
        calendarHTML += '</div>';

        // Calendar days
        let day = 1;
        for (let week = 0; week < 6; week++) {
            calendarHTML += '<div class="calendar-week">';
            for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
                if (week === 0 && dayOfWeek < startingDayOfWeek) {
                    calendarHTML += '<div class="calendar-day empty"></div>';
                } else if (day > daysInMonth) {
                    calendarHTML += '<div class="calendar-day empty"></div>';
                } else {
                    const currentDate = new Date(year, month, day);
                    const dayEvents = this.getEventsForDate(currentDate);
                    const isToday = this.isToday(currentDate);
                    const isCurrentMonth = currentDate.getMonth() === month;
                    
                    calendarHTML += `
                        <div class="calendar-day ${isToday ? 'today' : ''} ${!isCurrentMonth ? 'other-month' : ''}" 
                             data-date="${currentDate.toISOString().split('T')[0]}">
                            <div class="day-number">${day}</div>
                            <div class="day-events">
                                ${dayEvents.map(event => `
                                    <div class="event-item ${event.priority}" 
                                         title="${event.title} - ${event.organization}">
                                        ${event.title}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                    day++;
                }
            }
            calendarHTML += '</div>';
        }

        calendar.innerHTML = calendarHTML;
    }

    getEventsForDate(date) {
        const dateStr = date.toISOString().split('T')[0];
        return this.events.filter(event => event.date === dateStr);
    }

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    updateSidebar() {
        this.updateTodayEvents();
        this.updateUpcomingEvents();
        this.updateEventStats();
    }

    updateTodayEvents() {
        const todayEventsDiv = document.getElementById('todayEvents');
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const todayEvents = this.events.filter(event => event.date === todayStr);
        
        if (todayEvents.length === 0) {
            todayEventsDiv.innerHTML = '<div style="color: #9ca3af; font-style: italic;">No events today</div>';
        } else {
            todayEventsDiv.innerHTML = todayEvents.map(event => `
                <div class="sidebar-event">
                    <div class="event-title">${event.title}</div>
                    <div class="event-org">${event.organization}</div>
                </div>
            `).join('');
        }
    }

    updateUpcomingEvents() {
        const upcomingEventsDiv = document.getElementById('upcomingEvents');
        const today = new Date();
        const upcomingEvents = this.events
            .filter(event => new Date(event.date) > today)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5);
        
        if (upcomingEvents.length === 0) {
            upcomingEventsDiv.innerHTML = '<div style="color: #9ca3af; font-style: italic;">No upcoming events</div>';
        } else {
            upcomingEventsDiv.innerHTML = upcomingEvents.map(event => `
                <div class="sidebar-event">
                    <div class="event-title">${event.title}</div>
                    <div class="event-date">${new Date(event.date).toLocaleDateString()}</div>
                </div>
            `).join('');
        }
    }

    updateEventStats() {
        const totalEvents = this.events.length;
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const todayEvents = this.events.filter(event => event.date === todayStr).length;
        const upcomingEvents = this.events.filter(event => new Date(event.date) > today).length;
        
        document.getElementById('totalEvents').textContent = totalEvents;
        document.getElementById('todayEventsCount').textContent = todayEvents;
        document.getElementById('upcomingEventsCount').textContent = upcomingEvents;
    }
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calendar();
});
