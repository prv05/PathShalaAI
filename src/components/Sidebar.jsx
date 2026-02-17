import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    HelpCircle,
    TrendingUp,
    BrainCircuit,
    CalendarDays,
    Library,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Book
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate();
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: BookOpen, label: 'My Lessons', path: '/lessons' },
        { icon: HelpCircle, label: 'Ask Doubt', path: '/ask-doubt' },
        { icon: TrendingUp, label: 'Progress', path: '/progress' },
        { icon: BrainCircuit, label: 'AI Insights', path: '/ai-insights' },
        { icon: CalendarDays, label: 'Study Calendar', path: '/calendar' },
        { icon: Library, label: 'Resources', path: '/resources' },
    ];

    return (
        <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <div className="logo-container">
                    <div className="logo-icon-wrapper-sm">
                        <Book className="logo-icon-sm" />
                    </div>
                    {isOpen && <span className="logo-text">PathShalaAI</span>}
                </div>
                <button className="collapse-btn" onClick={toggleSidebar}>
                    {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? 'active' : ''}`
                        }
                    >
                        <item.icon size={22} />
                        {isOpen && <span className="nav-label">{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="avatar">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav" alt="User" />
                    </div>
                    {isOpen && (
                        <div className="user-info">
                            <p className="user-name">Aarav Sharma</p>
                            <p className="user-role">Student, Class 7</p>
                        </div>
                    )}
                </div>
                <button className="logout-btn" onClick={() => navigate('/')}>
                    <LogOut size={20} />
                    {isOpen && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
