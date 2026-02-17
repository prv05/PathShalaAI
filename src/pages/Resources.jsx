import React, { useState } from 'react';
import {
    FileText,
    Book,
    FileSpreadsheet,
    Link,
    Search,
    Download,
    ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import './Resources.css';

const Resources = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const stats = [
        { label: 'Notes', value: 12, icon: FileText },
        { label: 'References', value: 5, icon: Book },
        { label: 'Worksheets', value: 8, icon: FileSpreadsheet },
        { label: 'External', value: 4, icon: Link },
    ];

    const resources = [
        {
            id: 1,
            title: "NCERT Mathematics Formulae",
            description: "Complete formulae sheet for Class 7 Math covering Algebra, Geometry, and Mensuration.",
            subject: "Mathematics",
            type: "Notes",
            icon: FileText,
            action: "Download",
            color: "text-blue-600",
            bg: "bg-blue-100",
            tagColor: "bg-blue-50 text-blue-700"
        },
        {
            id: 2,
            title: "Science Lab Manual",
            description: "Virtual lab experiments and procedures for Chemistry and Physics practicals.",
            subject: "Science",
            type: "Reference",
            icon: Book,
            action: "Download",
            color: "text-green-600",
            bg: "bg-green-100",
            tagColor: "bg-green-50 text-green-700"
        },
        {
            id: 3,
            title: "English Grammar Workbook",
            description: "Practice exercises for tenses, articles, prepositions, and creative writing.",
            subject: "English",
            type: "Worksheet",
            icon: FileSpreadsheet,
            action: "Download",
            color: "text-yellow-600",
            bg: "bg-yellow-100",
            tagColor: "bg-yellow-50 text-yellow-700"
        },
        {
            id: 4,
            title: "History Timeline Cards",
            description: "Visual timeline of Indian history events from ancient to modern times.",
            subject: "Social Science",
            type: "Notes",
            icon: FileText,
            action: "Download",
            color: "text-pink-600",
            bg: "bg-pink-100",
            tagColor: "bg-pink-50 text-pink-700"
        },
        {
            id: 5,
            title: "Algebra Practice Set",
            description: "50 practice problems for algebraic expressions with step-by-step solutions.",
            subject: "Mathematics",
            type: "Worksheet",
            icon: FileSpreadsheet,
            action: "Download",
            color: "text-blue-600",
            bg: "bg-blue-100",
            tagColor: "bg-blue-50 text-blue-700"
        },
        {
            id: 6,
            title: "Periodic Table Interactive",
            description: "Interactive periodic table with element details, atomic mass, and properties.",
            subject: "Science",
            type: "External",
            icon: Link,
            action: "Open",
            color: "text-purple-600",
            bg: "bg-purple-100",
            tagColor: "bg-purple-50 text-purple-700"
        }
    ];

    const filters = ['All', 'Notes', 'Reference', 'Worksheet', 'External'];

    const filteredResources = resources.filter(res => {
        const matchesFilter = activeFilter === 'All' || res.type === activeFilter || (activeFilter === 'Reference' && res.type === 'Reference') || (activeFilter === 'Worksheet' && res.type === 'Worksheet'); // handling simple mapping
        const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || res.subject.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="resources-container">
            <div className="res-header">
                <h1 className="res-title">Resources</h1>
                <p className="res-subtitle">Access notes, worksheets, and learning materials</p>
            </div>

            {/* Stats */}
            <div className="res-stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="res-stat-card">
                        <div className="res-stat-content">
                            <h3>{stat.value}</h3>
                            <p>{stat.label}</p>
                        </div>
                        <div className="res-stat-icon">
                            <stat.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Search & Filter */}
            <div className="res-controls">
                <div className="res-search-box">
                    <Search className="res-search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search resources..."
                        className="res-search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="res-filter-tabs">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
                            onClick={() => setActiveFilter(filter)}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="res-grid">
                {filteredResources.map(resource => (
                    <div key={resource.id} className="resource-card">
                        <div className="res-card-top">
                            <div className={`res-icon-box ${resource.bg}`}>
                                <resource.icon size={24} className={resource.color} />
                            </div>
                            <span className={`res-subject-tag ${resource.tagColor}`}>
                                {resource.subject}
                            </span>
                        </div>
                        <div className="res-card-content">
                            <h3 className="res-card-title">{resource.title}</h3>
                            <p className="res-card-desc">{resource.description}</p>
                        </div>
                        <Button
                            className="res-action-btn"
                            variant={resource.action === 'Download' ? 'primary' : 'outline'}
                        >
                            {resource.action === 'Download' ? (
                                <><Download size={16} className="mr-2" /> Download</>
                            ) : (
                                <><ExternalLink size={16} className="mr-2" /> Open Link</>
                            )}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Resources;
