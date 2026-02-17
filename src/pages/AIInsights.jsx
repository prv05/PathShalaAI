import React from 'react';
import {
    Brain,
    TrendingUp,
    Target,
    Clock,
    AlertCircle,
    Eye,
    Lightbulb,
    CheckCircle2,
    ArrowUpRight,
    Minus
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import './AIInsights.css';

const AIInsights = () => {
    const navigate = useNavigate();

    // Mock Data
    const weakTopics = [
        { topic: 'Quadratic Equations', subject: 'Mathematics', score: 45, trend: 'improving', trendVal: '+5%' },
        { topic: 'Organic Chemistry', subject: 'Science', score: 52, trend: 'stable', trendVal: '0%' },
        { topic: 'Grammar - Tenses', subject: 'English', score: 60, trend: 'improving', trendVal: '+8%' },
    ];

    const examReadiness = [
        { subject: 'Mathematics', score: 75, fill: '#3b82f6' },
        { subject: 'Science', score: 85, fill: '#22c55e' },
        { subject: 'English', score: 95, fill: '#eab308' },
        { subject: 'Social Science', score: 65, fill: '#ec4899' },
    ];

    const predictionData = [
        { month: 'Oct', Action: 62, Predicted: 60 },
        { month: 'Nov', Action: 68, Predicted: 65 },
        { month: 'Dec', Action: 72, Predicted: 70 },
        { month: 'Jan', Action: 75, Predicted: 78 },
        { month: 'Feb', Action: null, Predicted: 82 },
        { month: 'Mar', Action: null, Predicted: 88 },
    ];

    const recommendations = [
        "Focus 30 min daily on Algebra problem-solving",
        "Review Chemical Equations with flashcards",
        "Practice essay writing twice a week",
        "Watch video explanations for Geography concepts"
    ];

    return (
        <div className="ai-insights-container">
            <div className="ai-header">
                <h1 className="ai-title">AI Learning Insights</h1>
                <p className="ai-subtitle">Intelligent analysis of your learning patterns and performance</p>
            </div>

            {/* Top Cards */}
            <div className="ai-stats-grid">
                {/* AI Score */}
                <div className="ai-stat-card">
                    <div className="ai-stat-header">
                        <div>
                            <div className="ai-stat-value text-blue-600">78</div>
                            <div className="ai-stat-label">AI Score</div>
                        </div>
                        <div className="ai-stat-icon bg-blue-100 text-blue-600">
                            <Brain size={24} />
                        </div>
                    </div>
                    <div className="ai-stat-meta text-green-600 flex items-center gap-1">
                        <TrendingUp size={14} /> +12% this week
                    </div>
                </div>

                {/* Status */}
                <div className="ai-stat-card">
                    <div className="ai-stat-header">
                        <div>
                            <div className="ai-stat-value text-green-600">On Track</div>
                            <div className="ai-stat-label">Status</div>
                        </div>
                        <div className="ai-stat-icon bg-green-100 text-green-600">
                            <CheckCircle2 size={24} />
                        </div>
                    </div>
                    <div className="ai-stat-meta text-gray-500">
                        Keep going!
                    </div>
                </div>

                {/* Next Priority */}
                <div className="ai-stat-card">
                    <div className="ai-stat-header">
                        <div>
                            <div className="ai-stat-value text-lg leading-tight mb-1">Quadratic Equations</div>
                            <div className="ai-stat-label">Next Priority</div>
                        </div>
                        <div className="ai-stat-icon bg-orange-100 text-orange-600">
                            <AlertCircle size={24} />
                        </div>
                    </div>
                    <div className="ai-stat-meta text-orange-600">
                        Focus area • Algebra
                    </div>
                </div>

                {/* Best Time */}
                <div className="ai-stat-card">
                    <div className="ai-stat-header">
                        <div>
                            <div className="ai-stat-value text-purple-600">Morning</div>
                            <div className="ai-stat-label">Best Study Time</div>
                        </div>
                        <div className="ai-stat-icon bg-purple-100 text-purple-600">
                            <Clock size={24} />
                        </div>
                    </div>
                    <div className="ai-stat-meta text-gray-500">
                        9-11 AM • 42 min avg
                    </div>
                </div>
            </div>

            {/* Middle Section: Weak Topics & Exam Readiness */}
            <div className="ai-main-grid">
                <div className="ai-card">
                    <div className="section-header">
                        <h2 className="section-title flex items-center gap-2">
                            <AlertCircle size={20} className="text-orange-500" />
                            Weak Topic Intelligence
                        </h2>
                    </div>
                    <div>
                        {weakTopics.map((item, index) => (
                            <div key={index} className="topic-item">
                                <div className="topic-header">
                                    <span>{item.topic} <span className="text-gray-400 font-normal">({item.subject})</span></span>
                                    <span className="font-bold">{item.score}%</span>
                                </div>
                                <div className="topic-progress-bg">
                                    <div
                                        className={`topic-progress-fill ${item.score < 50 ? 'bg-red-500' : 'bg-yellow-500'}`}
                                        style={{ width: `${item.score}%` }}
                                    ></div>
                                </div>
                                <div className="topic-meta text-gray-500">
                                    <span className="capitalize flex items-center gap-1">
                                        {item.trend === 'improving' ? <ArrowUpRight size={12} className="text-green-500" /> : <Minus size={12} className="text-gray-400" />}
                                        {item.trend}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="ai-card">
                    <div className="section-header">
                        <h2 className="section-title">Exam Readiness</h2>
                    </div>
                    <div style={{ width: '100%', height: 200 }}>
                        <ResponsiveContainer>
                            <BarChart data={examReadiness} layout="vertical" margin={{ left: 40, right: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" domain={[0, 100]} hide />
                                <YAxis dataKey="subject" type="category" width={80} tick={{ fontSize: 12 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                                    {examReadiness.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Trend Prediction & Recommendations */}
            <div className="ai-main-grid">
                <div className="ai-card">
                    <div className="section-header">
                        <h2 className="section-title flex items-center gap-2">
                            <TrendingUp size={20} className="text-blue-500" />
                            Learning Trend Prediction
                        </h2>
                    </div>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={predictionData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend />
                                <Bar dataKey="Action" name="Actual Score" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                                <Bar dataKey="Predicted" name="AI Predicted" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-sm text-gray-500 mt-4 text-center">
                        *AI prediction based on current study habits and performance consistency.
                    </p>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Learning Style */}
                    <div className="ai-card learning-style-card">
                        <div className="style-badge">
                            <Eye size={18} /> Visual Learner
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            You learn best through diagrams, charts, and visual explanations. We tailor content with more visual aids for you.
                        </p>
                    </div>

                    {/* Recommendations */}
                    <div className="ai-card flex-1">
                        <div className="section-header">
                            <h2 className="section-title flex items-center gap-2">
                                <Lightbulb size={20} className="text-yellow-500" />
                                Smart Recommendations
                            </h2>
                        </div>
                        <ul className="rec-list">
                            {recommendations.map((rec, index) => (
                                <li key={index} className="rec-item">
                                    <Lightbulb size={16} className="rec-icon" />
                                    <span className="rec-text">{rec}</span>
                                </li>
                            ))}
                        </ul>
                        <Button className="study-cal-btn" onClick={() => navigate('/calendar')}>
                            Open Study Calendar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default AIInsights;

