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
    Star
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from 'recharts';
import './Progress.css';

const Progress = () => {
    const stats = [
        { icon: BookOpen, label: 'Lessons Done', value: '58', color: 'text-blue-500', bg: 'bg-blue-100' },
        { icon: Clock, label: 'Hours Spent', value: '42h', color: 'text-green-500', bg: 'bg-green-100' },
        { icon: Flame, label: 'Day Streak', value: '12', color: 'text-orange-500', bg: 'bg-orange-100' },
        { icon: Trophy, label: 'Avg Score', value: '69%', color: 'text-purple-500', bg: 'bg-purple-100' },
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

    const scoreTrendData = [
        { week: 'W1', score: 55 },
        { week: 'W2', score: 60 },
        { week: 'W3', score: 58 },
        { week: 'W4', score: 65 },
        { week: 'W5', score: 72 },
        { week: 'W6', score: 78 },
    ];

    const radarData = [
        { subject: 'Math', A: 72, fullMark: 100 },
        { subject: 'Science', A: 65, fullMark: 100 },
        { subject: 'English', A: 80, fullMark: 100 },
        { subject: 'Social', A: 58, fullMark: 100 },
        { subject: 'Comp', A: 85, fullMark: 100 },
        { subject: 'EVS', A: 60, fullMark: 100 },
    ];

    const subjectPerformance = [
        { name: 'Mathematics', topic: 'Algebraic Expressions', progress: 72, completed: 18, total: 25, icon: Calculator, color: 'text-blue-500', bg: 'bg-blue-100', barColor: '#3b82f6' },
        { name: 'Science', topic: 'Chemical Reactions', progress: 65, completed: 13, total: 20, icon: FlaskConical, color: 'text-green-500', bg: 'bg-green-100', barColor: '#22c55e' },
        { name: 'English', topic: 'Creative Writing', progress: 80, completed: 16, total: 20, icon: Book, color: 'text-yellow-500', bg: 'bg-yellow-100', barColor: '#eab308' },
        { name: 'Social Science', topic: 'Indian Freedom Movement', progress: 58, completed: 11, total: 19, icon: Globe, color: 'text-pink-500', bg: 'bg-pink-100', barColor: '#ec4899' },
    ];

    return (
        <div className="progress-page-container">
            <div className="progress-header">
                <div>
                    <h1 className="progress-title">My Progress</h1>
                    <p className="progress-subtitle">Track your learning journey, Aarav</p>
                </div>

                <div className="class-badge">
                    <div className="class-info">Class 7 | CBSE</div>
                    <div className="badge-divider"></div>
                    <div className="score-info">
                        <Star size={16} fill="#f97316" color="#f97316" />
                        <span>Score: 69</span>
                    </div>
                </div>
            </div>

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

            <div className="charts-grid-row">
                {/* Weekly Study Hours */}
                <div className="chart-card-progress">
                    <h3 className="section-title">Weekly Study Hours</h3>
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
                                <Bar dataKey="hours" fill="#4F7FFF" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Score Trend */}
                <div className="chart-card-progress">
                    <h3 className="section-title">Score Trend</h3>
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <LineChart data={scoreTrendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="week" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Line type="monotone" dataKey="score" stroke="#f97316" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bottom-grid-row">
                {/* Subject Performance List */}
                <div className="subject-perf-container">
                    <h3 className="section-title">Subject Performance</h3>
                    <div className="subject-perf-list">
                        {subjectPerformance.map((subject, index) => (
                            <div key={index} className="subject-perf-card">
                                <div className={`subject-icon-box ${subject.bg}`}>
                                    <subject.icon size={24} className={subject.color} />
                                </div>
                                <div className="subject-perf-details">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="subject-perf-name">{subject.name}</span>
                                        <span className="subject-perf-percent">{subject.progress}%</span>
                                    </div>
                                    <div className="subject-perf-topic">{subject.topic}</div>

                                    <div className="progress-bar-bg-perf">
                                        <div
                                            className="progress-bar-fill-perf"
                                            style={{ width: `${subject.progress}%`, backgroundColor: subject.barColor }}
                                        ></div>
                                    </div>

                                    <div className="subject-perf-meta">
                                        {subject.completed}/{subject.total} Lessons Completed
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Radar Chart */}
                <div className="radar-chart-container">
                    <h3 className="section-title">Skills Radar</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Student"
                                    dataKey="A"
                                    stroke="#4F7FFF"
                                    strokeWidth={2}
                                    fill="#4F7FFF"
                                    fillOpacity={0.3}
                                />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Progress;
