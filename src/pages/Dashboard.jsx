import React from 'react';
import {
    Flame,
    BookOpen,
    Clock,
    Trophy,
    Calculator,
    FlaskConical,
    Book,
    Globe,
    HelpCircle,
    FileText,
    PlayCircle
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const stats = [
        { icon: Flame, label: 'Day Streak', value: '12', color: 'text-orange-500', bg: 'bg-orange-100' },
        { icon: BookOpen, label: 'Lessons Done', value: '58', color: 'text-blue-500', bg: 'bg-blue-100' },
        { icon: Clock, label: 'Hours Learned', value: '42h', color: 'text-green-500', bg: 'bg-green-100' },
        { icon: Trophy, label: 'Quiz Score', value: '78%', color: 'text-yellow-500', bg: 'bg-yellow-100' },
    ];

    const subjects = [
        { name: 'Mathematics', topic: 'Algebraic Expressions', progress: 18, total: 25, icon: Calculator, color: 'text-blue-500', bg: 'bg-blue-100', barColor: '#3b82f6' },
        { name: 'Science', topic: 'Chemical Reactions', progress: 13, total: 20, icon: FlaskConical, color: 'text-green-500', bg: 'bg-green-100', barColor: '#22c55e' },
        { name: 'English', topic: 'Creative Writing', progress: 16, total: 20, icon: Book, color: 'text-yellow-500', bg: 'bg-yellow-100', barColor: '#eab308' },
        { name: 'Social Science', topic: 'Indian Freedom Movement', progress: 11, total: 19, icon: Globe, color: 'text-pink-500', bg: 'bg-pink-100', barColor: '#ec4899' },
    ];

    const weeklyData = [
        { day: 'Mon', hours: 2.5 },
        { day: 'Tue', hours: 3.2 },
        { day: 'Wed', hours: 1.5 },
        { day: 'Thu', hours: 4.0 },
        { day: 'Fri', hours: 2.8 },
        { day: 'Sat', hours: 3.5 },
        { day: 'Sun', hours: 1.0 },
    ];

    const pieData = [
        { name: 'Math', value: 72, color: '#3b82f6' },
        { name: 'Science', value: 65, color: '#22c55e' },
        { name: 'English', value: 80, color: '#eab308' },
    ];

    // Calculate total progress for the center of the pie
    const overallProgress = 69;

    return (
        <div className="dashboard-container">
            {/* Welcome Header */}
            <div className="dashboard-header">
                <div>
                    <h1 className="welcome-text">Welcome back, Aarav! 👋</h1>
                    <p className="subtitle-text">You have a <span className="highlight-orange">12 day streak</span>! Keep it up!</p>
                </div>
                <Button size="lg" className="resume-btn" onClick={() => navigate('/lessons')}>Resume Learning</Button>
            </div>

            {/* Stats Row */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className={`stat-icon-wrapper ${stat.bg}`}>
                            <stat.icon size={24} className={stat.color} />
                        </div>
                        <div>
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="main-grid">
                <div className="left-column">
                    {/* Today's Lesson */}
                    <div className="lesson-card-large">
                        <div className="lesson-header">
                            <span className="tag-yellow">Mathematics</span>
                            <span className="chapter-text">Chapter 7</span>
                        </div>
                        <h2 className="lesson-title">Introduction to Algebraic Expressions</h2>
                        <div className="progress-container">
                            <div className="progress-bar-bg">
                                <div className="progress-bar-fill" style={{ width: '85%' }}></div>
                            </div>
                            <span className="progress-text">85% Complete</span>
                        </div>
                        <Button className="mt-4" onClick={() => navigate('/lessons')}>Continue Learning</Button>
                    </div>

                    {/* Your Subjects */}
                    <h3 className="section-title">Your Subjects</h3>
                    <div className="subjects-grid">
                        {subjects.map((subject, index) => (
                            <div key={index} className="subject-card-dashboard" onClick={() => navigate('/lessons')} style={{ cursor: 'pointer' }}>
                                <div className="subject-header">
                                    <div className={`subject-icon-box ${subject.bg}`}>
                                        <subject.icon size={20} className={subject.color} />
                                    </div>
                                    <span className="subject-name-dash">{subject.name}</span>
                                </div>
                                <div className="subject-topic">{subject.topic}</div>
                                <div className="subject-progress">
                                    <div className="progress-bar-bg-sm">
                                        <div
                                            className="progress-bar-fill-sm"
                                            style={{ width: `${(subject.progress / subject.total) * 100}%`, backgroundColor: subject.barColor }}
                                        ></div>
                                    </div>
                                    <span className="progress-fraction">{subject.progress}/{subject.total} Lessons</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Weekly Activity Chart */}
                    <div className="chart-card">
                        <h3 className="section-title">Weekly Activity</h3>
                        <div style={{ width: '100%', height: 250 }}>
                            <ResponsiveContainer>
                                <BarChart data={weeklyData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="hours" fill="#4F7FFF" radius={[4, 4, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="right-column">
                    {/* Overall Progress */}
                    <div className="progress-widget">
                        <h3 className="section-title">Overall Progress</h3>
                        <div className="circular-chart-wrapper" onClick={() => navigate('/progress')} style={{ cursor: 'pointer' }}>
                            <div style={{ width: '100%', height: 200, position: 'relative' }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="chart-center-text">
                                    <div className="chart-percentage">{overallProgress}%</div>
                                    <div className="chart-label">Total</div>
                                </div>
                            </div>

                            <div className="subject-breakdown">
                                {pieData.map((subject, index) => (
                                    <div key={index} className="breakdown-item">
                                        <span className="breakdown-dot" style={{ backgroundColor: subject.color }}></span>
                                        <span className="breakdown-name">{subject.name}</span>
                                        <span className="breakdown-val">{subject.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-actions-card">
                        <h3 className="section-title">Quick Actions</h3>
                        <div className="actions-list">
                            <button className="action-btn" onClick={() => navigate('/ask-doubt')}>
                                <div className="action-icon-wrapper bg-blue-100">
                                    <HelpCircle size={20} className="text-blue-500" />
                                </div>
                                <span>Ask a Doubt</span>
                            </button>
                            <button className="action-btn" onClick={() => navigate('/resources')}>
                                <div className="action-icon-wrapper bg-green-100">
                                    <FileText size={20} className="text-green-500" />
                                </div>
                                <span>Review Notes</span>
                            </button>
                            <button className="action-btn" onClick={() => navigate('/lessons')}>
                                <div className="action-icon-wrapper bg-yellow-100">
                                    <PlayCircle size={20} className="text-yellow-500" />
                                </div>
                                <span>Watch Video</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
