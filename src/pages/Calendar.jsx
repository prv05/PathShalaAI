import React, { useState } from 'react';
import {
    Target,
    Leaf,
    Clock,
    Flame,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    CheckCircle2,
    Circle,
    MoreHorizontal
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import './Calendar.css';

const Calendar = () => {
    const navigate = useNavigate();

    // Mock Data
    const stats = [
        { icon: Target, label: "Today's Goal", value: "4 tasks", color: "text-blue-600", bg: "bg-blue-100" },
        { icon: Leaf, label: "AI Readiness", value: "78%", color: "text-green-600", bg: "bg-green-100" },
        { icon: Clock, label: "Next Exam", value: "3 days", color: "text-purple-600", bg: "bg-purple-100" },
        { icon: Flame, label: "Study Streak", value: "12 days", color: "text-orange-600", bg: "bg-orange-100" },
    ];

    const taskList = [
        { title: 'Complete Algebra Practice Set', subject: 'Mathematics', duration: '30 min', completed: true },
        { title: 'Watch Chemical Reactions Video', subject: 'Science', duration: '20 min', completed: false },
        { title: 'Read Poetry Chapter', subject: 'English', duration: '25 min', completed: false },
        { title: 'Revise Indian Freedom Movement', subject: 'Social Science', duration: '35 min', completed: false },
        { title: 'Solve Linear Equations Worksheet', subject: 'Mathematics', duration: '40 min', completed: true },
    ];

    const aiRecommendations = [
        { title: 'Algebra Practice', duration: '30 min', icon: BookOpen },
        { title: 'Science Revision', duration: '20 min', icon: CheckCircle2 },
        { title: 'English Reading', duration: '25 min', icon: BookOpen },
    ];

    const [currentDate, setCurrentDate] = useState(new Date(2026, 1)); // Feb 2026
    const [selectedDate, setSelectedDate] = useState(new Date(2026, 1, 9)); // Mock today: Feb 9, 2026

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const startDay = getFirstDayOfMonth(year, month);

    // Dynamic Schedule Generator
    const getScheduleForDate = (date) => {
        const day = date.getDate();
        const subjects = [
            { title: 'Algebra', tag: 'Mathematics', icon: BookOpen, color: 'text-blue-500' },
            { title: 'Chemical Reactions', tag: 'Science', icon: CheckCircle2, color: 'text-green-500' },
            { title: 'Poetry Analysis', tag: 'English', icon: BookOpen, color: 'text-yellow-500' },
            { title: 'History: Freedom Movement', tag: 'Social Science', icon: CheckCircle2, color: 'text-pink-500' },
            { title: 'Linear Equations', tag: 'Mathematics', icon: BookOpen, color: 'text-blue-500' }
        ];

        // Pseudo-randomly pick 2-3 tasks based on date
        const count = (day % 2) + 2;
        const schedule = [];
        for (let i = 0; i < count; i++) {
            const subjIndex = (day + i) % subjects.length;
            const hour = 10 + (i * 2); // 10am, 12pm, 2pm...
            schedule.push({
                time: `${hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
                ...subjects[subjIndex],
                title: `${subjects[subjIndex].title} ${i === 0 ? 'Lesson' : 'Revision'}`
            });
        }
        return schedule;
    };

    const currentSchedule = getScheduleForDate(selectedDate);

    // Helper to check if a date matches the selected date
    const isSameDay = (d1, d2) => {
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    };

    const calendarDays = [];

    // Empty slots for prev month
    for (let i = 0; i < startDay; i++) {
        calendarDays.push({ day: '', type: 'empty' });
    }

    // Days
    for (let i = 1; i <= daysInMonth; i++) {
        let type = 'normal';
        const thisDate = new Date(year, month, i);

        // Simple mock: every 7th day is a quiz
        if (i % 7 === 0) type = 'quiz';

        // Mark actual today (Mocking "Today" as 9th of current month for demo)
        const isToday = (i === 9 && month === 1 && year === 2026);
        if (isToday) type = 'today';

        // Exams on 22, 23, 24 for any month
        if ([22, 23, 24].includes(i)) type = 'exam';

        calendarDays.push({
            day: i,
            type,
            date: thisDate,
            isSelected: isSameDay(thisDate, selectedDate)
        });
    }

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const handleDateClick = (dayObj) => {
        if (dayObj.type !== 'empty') {
            setSelectedDate(dayObj.date);
        }
    };

    const handleAutoSchedule = () => {
        alert("AI is optimizing your schedule based on your weak topics...");
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return (
        <div className="calendar-container">
            <div className="cal-header">
                <div>
                    <h1 className="cal-title">AI Study Calendar</h1>
                    <p className="cal-subtitle">Smart scheduling powered by AI for optimal learning</p>
                </div>
            </div>

            {/* Top Stats */}
            <div className="cal-stats-row">
                {stats.map((stat, index) => (
                    <div key={index} className="cal-stat-card">
                        <div className={`cal-stat-icon-box ${stat.bg}`}>
                            <stat.icon size={24} className={stat.color} />
                        </div>
                        <div className="cal-stat-info">
                            <h3>{stat.value}</h3>
                            <p>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="cal-layout">
                <div className="cal-main-col">
                    {/* Calendar Grid */}
                    <div className="cal-main-card mb-6">
                        <div className="cal-month-header">
                            <h2 className="cal-month-title">{monthNames[month]} {year}</h2>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={prevMonth}><ChevronLeft size={16} /></Button>
                                <Button variant="outline" size="sm" onClick={nextMonth}><ChevronRight size={16} /></Button>
                            </div>
                        </div>

                        <div className="cal-day-header display-grid grid-cols-7 gap-2 mb-2 grid">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                <div key={d} className="text-center text-sm font-semibold text-gray-400">{d}</div>
                            ))}
                        </div>

                        <div className="cal-grid">
                            {calendarDays.map((date, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleDateClick(date)}
                                    className={`cal-day-cell 
                                        ${date.isSelected ? 'selected-day' : ''} 
                                        ${date.type === 'today' ? 'today-marker' : ''} 
                                        ${date.type === 'empty' ? 'other-month' : ''}
                                        cursor-pointer hover:bg-gray-50 transition-colors
                                    `}
                                >
                                    {date.day}
                                    {date.day && date.type !== 'empty' && (
                                        <div className="cal-dots">
                                            {/* Mock dots */}
                                            {date.type !== 'normal' && (
                                                <div
                                                    className={`cal-dot ${date.type === 'quiz' ? 'bg-yellow-400' :
                                                        date.type === 'exam' ? 'bg-red-400' :
                                                            date.type === 'today' ? 'bg-blue-500' : 'bg-blue-400'
                                                        }`}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="cal-legend">
                            <div className="legend-item"><div className="legend-color bg-blue-400"></div> Lesson</div>
                            <div className="legend-item"><div className="legend-color bg-green-400"></div> Revision</div>
                            <div className="legend-item"><div className="legend-color bg-yellow-400"></div> Quiz</div>
                            <div className="legend-item"><div className="legend-color bg-red-400"></div> Exam</div>
                        </div>
                    </div>

                    {/* Task Checklist (Scrolled View) */}
                    <div className="cal-main-card task-checklist">
                        <div className="checklist-header">
                            <h2 className="section-title">Today's Tasks</h2>
                            <span className="text-sm font-semibold text-gray-500">2/5 Done</span>
                        </div>
                        <div className="flex flex-col">
                            {taskList.map((task, index) => (
                                <div key={index} className="checklist-item">
                                    <div className={`checklist-check-wrapper`}>
                                        {task.completed ? (
                                            <CheckCircle2 size={24} className="text-green-500" />
                                        ) : (
                                            <Circle size={24} className="text-gray-300" />
                                        )}
                                    </div>
                                    <div className="checklist-content">
                                        <div className={`checklist-text ${task.completed ? 'completed' : ''}`}>
                                            {task.title}
                                        </div>
                                        <div className="checklist-meta">
                                            <span>{task.subject}</span> • <span>{task.duration}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="cal-daily-panel">
                    {/* Selected Day Schedule */}
                    <div className="daily-card">
                        <div className="daily-header">
                            Daily Schedule
                            <span className="text-sm font-normal text-blue-600">
                                {dayNames[selectedDate.getDay()]}, {monthNames[selectedDate.getMonth()].substr(0, 3)} {selectedDate.getDate()}
                            </span>
                        </div>
                        <div className="schedule-list">
                            {currentSchedule.length > 0 ? currentSchedule.map((item, index) => (
                                <div key={index} className="schedule-item">
                                    <div className="schedule-time">{item.time.split(' ')[0]}<span className="text-xs ml-1">{item.time.split(' ')[1]}</span></div>
                                    <div className="schedule-content">
                                        <div className="schedule-title">{item.title}</div>
                                        <div className="schedule-tag">
                                            <item.icon size={12} className={item.color} /> {item.tag}
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-4 text-center text-gray-500 text-sm">No tasks scheduled for this day. Enjoy your break!</div>
                            )}
                        </div>
                    </div>

                    {/* AI Planner Widget */}
                    <div className="daily-card ai-planner-widget">
                        <div className="ai-rec-title">
                            <BrainIcon size={16} /> AI recommends focusing on:
                        </div>
                        <div className="ai-task-list">
                            {aiRecommendations.map((rec, index) => (
                                <div key={index} className="ai-task">
                                    <div className="ai-task-left">
                                        <rec.icon size={16} className="text-blue-500" />
                                        <div>
                                            <div className="ai-task-text">{rec.title}</div>
                                            <div className="ai-task-sub">{rec.duration}</div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal size={14} /></Button>
                                </div>
                            ))}
                        </div>
                        <Button className="auto-schedule-btn" onClick={handleAutoSchedule}>
                            Auto-Schedule with AI
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Icon
const BrainIcon = ({ size, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
);

export default Calendar;
