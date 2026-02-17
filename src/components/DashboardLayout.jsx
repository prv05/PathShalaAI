import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header'; // Reusing Header for top bar if needed, or creating a new top bar logic
import './DashboardLayout.css';
import { Menu } from 'lucide-react';

const DashboardLayout = ({ theme, toggleTheme }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="dashboard-layout">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="dashboard-main">
                {/* Mobile Header */}
                <div className="mobile-header">
                    <button onClick={toggleSidebar} className="menu-btn">
                        <Menu size={24} />
                    </button>
                    <span className="mobile-logo">PathShalaAI</span>
                </div>

                {/* We can re-use the Header component here if we want the theme toggle on top right
            But Sidebar has logo. So we might just want the Theme Toggle and Language.
            Let's keep the Header but maybe hide the Logo part via CSS or props if inside layout?
            For now, I'll just put the theme toggle directly here or use Header.
         */}
                <div className="top-bar">
                    <Header theme={theme} toggleTheme={toggleTheme} />
                </div>

                <div className="content-area">
                    <Outlet />
                </div>
            </div>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
        </div>
    );
};

export default DashboardLayout;
