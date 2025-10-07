// Simple Working Calendar V3
class Calendar {
    constructor() {
        console.log('Simple Calendar constructor called');
        this.currentDate = new Date();
        this.selectedDate = null;
        this.events = [];
        this.currentView = 'month';
        
        this.init();
    }

    init() {
        console.log('Simple Calendar init called');
        this.loadEvents();
        this.setupEventListeners();
        this.render();
    }

    loadEvents() {
        console.log('Loading simple events...');
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        this.events = [
            {
                id: 1,
                title: 'Test Event Today',
                date: this.formatDateForInput(today),
                time: '10:00',
                description: 'Test event to verify calendar is working',
                organization: 'Test Org',
                type: 'conference',
                priority: 'high'
            },
            {
                id: 2,
                title: 'Test Event Tomorrow',
                date: this.formatDateForInput(tomorrow),
                time: '14:00',
                description: 'Another test event for tomorrow',
                organization: 'Test Org',
                type: 'workshop',
                priority: 'medium'
            },
            {
                id: 3,
                title: 'MIT Human Flourishing Workshop',
                date: '2025-10-14',
                time: '09:00',
                description: 'Workshop on Benchmarks for Human Flourishing with AI',
                organization: 'MIT Media Lab - AHA',
                type: 'workshop',
                priority: 'high'
            }
        ];
        
        console.log('Events loaded:', this.events.length, 'events');
        console.log('All events:', this.events);
    }

    setupEventListeners() {
        // Navigation
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const todayBtn = document.getElementById('todayBtn');

        if (prevBtn) prevBtn.addEventListener('click', () => this.navigate(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => this.navigate(1));
        if (todayBtn) todayBtn.addEventListener('click', () => this.goToToday());

        // View toggles
        document.querySelectorAll('.btn-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.dataset.view;
                this.changeView(view);
            });
        });

        // Add event button
        const addEventBtn = document.getElementById('addEventBtn');
        if (addEventBtn) {
            addEventBtn.addEventListener('click', () => this.showEventModal());
        }
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
        const activeBtn = document.querySelector(`[data-view="${view}"]`);
        if (activeBtn) activeBtn.classList.add('active');
        this.render();
    }

    render() {
        console.log('Rendering calendar with', this.events.length, 'events');
        this.updateHeader();
        this.renderCalendar();
    }

    updateHeader() {
        const options = { year: 'numeric', month: 'long' };
        const monthYear = this.currentDate.toLocaleDateString('en-US', options);
        const monthYearElement = document.querySelector('.month-year');
        if (monthYearElement) {
            monthYearElement.textContent = monthYear;
        }
    }

    renderCalendar() {
        const calendarGrid = document.querySelector('.calendar-grid');
        if (!calendarGrid) {
            console.error('Calendar grid not found!');
            return;
        }
        
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
        
        console.log(`Day ${date.toDateString()}: found ${dayEvents.length} events`);
        
        if (dayEvents.length > 0) {
            console.log(`Creating ${dayEvents.length} event dots for ${date.toDateString()}`);
            dayEvents.slice(0, 3).forEach(event => {
                console.log(`Creating event dot for: ${event.title}`);
                const eventDot = document.createElement('div');
                eventDot.className = 'event-dot';
                eventDot.textContent = event.title;
                eventDot.style.background = '#4f46e5';
                eventDot.style.color = 'white';
                eventDot.style.padding = '2px 5px';
                eventDot.style.borderRadius = '3px';
                eventDot.style.fontSize = '12px';
                eventDot.style.margin = '1px';
                eventDot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    console.log('Event clicked:', event.title);
                    alert(`Event: ${event.title}\nDate: ${event.date}\nTime: ${event.time}`);
                });
                eventsContainer.appendChild(eventDot);
            });
            
            if (dayEvents.length > 3) {
                const moreEvents = document.createElement('div');
                moreEvents.className = 'event-dot';
                moreEvents.textContent = `+${dayEvents.length - 3} more`;
                moreEvents.style.background = '#64748b';
                moreEvents.style.color = 'white';
                moreEvents.style.padding = '2px 5px';
                moreEvents.style.borderRadius = '3px';
                moreEvents.style.fontSize = '12px';
                moreEvents.style.margin = '1px';
                eventsContainer.appendChild(moreEvents);
            }
        }
        
        dayElement.appendChild(eventsContainer);
        
        dayElement.addEventListener('click', () => {
            this.selectedDate = date;
            console.log('Day clicked:', date.toDateString());
        });
        
        return dayElement;
    }

    getEventsForDate(date) {
        const dayEvents = this.events.filter(event => {
            const eventDate = new Date(event.date);
            return this.isSameDay(eventDate, date);
        });
        
        console.log(`getEventsForDate(${date.toDateString()}): found ${dayEvents.length} events`);
        return dayEvents;
    }

    isSameDay(date1, date2) {
        const result = date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
        return result;
    }

    formatDateForInput(date) {
        return date.toISOString().split('T')[0];
    }

    showEventModal() {
        alert('Add Event functionality would go here');
    }
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, creating simple calendar...');
    window.calendar = new Calendar();
});

