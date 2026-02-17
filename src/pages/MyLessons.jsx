import React, { useState } from 'react';
import { Search, Calculator, FlaskConical, Book, Globe, Filter } from 'lucide-react';
import LessonCard from '../components/LessonCard';
import './MyLessons.css';

const MyLessons = () => {
    const [activeSubject, setActiveSubject] = useState('All');
    const [activeFilter, setActiveFilter] = useState('All');

    const subjects = [
        { name: 'Mathematics', progress: '72%', color: 'border-blue-500 text-blue-500', bg: 'bg-blue-50' },
        { name: 'Science', progress: '65%', color: 'border-green-500 text-green-500', bg: 'bg-green-50' },
        { name: 'English', progress: '80%', color: 'border-yellow-500 text-yellow-500', bg: 'bg-yellow-50' },
        { name: 'Social Science', progress: '58%', color: 'border-pink-500 text-pink-500', bg: 'bg-pink-50' },
    ];

    const lessons = [
        {
            id: 1,
            title: "Introduction to Algebraic Expressions",
            subject: "Mathematics",
            chapter: 7,
            duration: "25 min",
            progress: 85,
            status: "In Progress",
            icon: Calculator,
            color: "text-blue-500",
            bg: "bg-blue-100"
        },
        {
            id: 2,
            title: "Chemical Reactions & Equations",
            subject: "Science",
            chapter: 4,
            duration: "30 min",
            progress: 100,
            status: "Completed",
            icon: FlaskConical,
            color: "text-green-500",
            bg: "bg-green-100"
        },
        {
            id: 3,
            title: "The Rime of the Ancient Mariner",
            subject: "English",
            chapter: 10,
            duration: "20 min",
            progress: 40,
            status: "In Progress",
            icon: Book,
            color: "text-yellow-500",
            bg: "bg-yellow-100"
        },
        {
            id: 4,
            title: "The Making of Indian Constitution",
            subject: "Social Science",
            chapter: 2,
            duration: "35 min",
            progress: 0,
            status: "Not Started",
            icon: Globe,
            color: "text-pink-500",
            bg: "bg-pink-100"
        },
        {
            id: 5,
            title: "Linear Equations in One Variable",
            subject: "Mathematics",
            chapter: 2,
            duration: "40 min",
            progress: 10,
            status: "In Progress",
            icon: Calculator,
            color: "text-blue-500",
            bg: "bg-blue-100"
        },
        {
            id: 6,
            title: "Force and Pressure",
            subject: "Science",
            chapter: 8,
            duration: "28 min",
            progress: 100,
            status: "Completed",
            icon: FlaskConical,
            color: "text-green-500",
            bg: "bg-green-100"
        },
        {
            id: 7,
            title: "Letter Writing",
            subject: "English",
            chapter: 12,
            duration: "15 min",
            progress: 0,
            status: "Not Started",
            icon: Book,
            color: "text-yellow-500",
            bg: "bg-yellow-100"
        },
        {
            id: 8,
            title: "Resources and Development",
            subject: "Social Science",
            chapter: 1,
            duration: "32 min",
            progress: 5,
            status: "In Progress",
            icon: Globe,
            color: "text-pink-500",
            bg: "bg-pink-100"
        },
    ];

    const [searchQuery, setSearchQuery] = useState('');

    const filteredLessons = lessons.filter(lesson => {
        const matchSubject = activeSubject === 'All' || lesson.subject === activeSubject;
        const matchFilter = activeFilter === 'All' ||
            (activeFilter === 'In Progress' && lesson.progress > 0 && lesson.progress < 100) ||
            (activeFilter === 'Completed' && lesson.progress === 100) ||
            (activeFilter === 'Not Started' && lesson.progress === 0);

        const matchSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lesson.subject.toLowerCase().includes(searchQuery.toLowerCase());

        return matchSubject && matchFilter && matchSearch;
    });

    return (
        <div className="mylessons-container">
            <div className="page-header">
                <h1 className="page-title">My Lessons</h1>
                <p className="page-subtitle">Continue learning where you left off</p>
            </div>

            {/* Subject Filter Tabs */}
            <div className="subjects-tabs">
                <button
                    className={`subject-tab ${activeSubject === 'All' ? 'active' : ''}`}
                    onClick={() => setActiveSubject('All')}
                >
                    All Subjects
                </button>
                {subjects.map((sub, index) => (
                    <button
                        key={index}
                        className={`subject-tab ${activeSubject === sub.name ? 'active ' + sub.color : ''}`}
                        onClick={() => setActiveSubject(sub.name)}
                    >
                        {sub.name} <span className="tab-progress">{sub.progress}</span>
                    </button>
                ))}
            </div>

            {/* Search and Filter */}
            <div className="controls-row">
                <div className="search-bar">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search lessons..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="filter-tabs">
                    {['All', 'In Progress', 'Completed', 'Not Started'].map((filter) => (
                        <button
                            key={filter}
                            className={`filter-pill ${activeFilter === filter ? 'active' : ''}`}
                            onClick={() => setActiveFilter(filter)}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Lesson List */}
            {filteredLessons.length > 0 ? (
                <div className="lessons-list">
                    {filteredLessons.map((lesson) => (
                        <LessonCard key={lesson.id} lesson={lesson} />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon-box">
                        <Search size={40} className="text-gray-400" />
                    </div>
                    <h3>No lessons found</h3>
                    <p>Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    );
};

export default MyLessons;
