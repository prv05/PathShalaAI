import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';

import ClassSelection from './components/ClassSelection';
import SubjectSelection from './components/SubjectSelection';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import MyLessons from './pages/MyLessons';
import AskDoubt from './pages/AskDoubt';
import Progress from './pages/Progress';
import AlternativeLogin from './pages/AlternativeLogin';
import AIInsights from './pages/AIInsights';
import Calendar from './pages/Calendar';
import Resources from './pages/Resources';
import SignupPage from './pages/SignupPage';
import './App.css';

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Check system preference or localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <div className="app-container">
        {/* We use Routes to determine where Headers show up.
            For dashboard/lessons, we use DashboardLayout which handles Sidebar/Header.
            For initial flow, we use the simple Header.
         */}
        <Routes>
          {/* Public/Onboarding Routes */}
          <Route path="/" element={<SignupPage theme={theme} toggleTheme={toggleTheme} />} />
          <Route path="/class-selection" element={
            <>
              <Header theme={theme} toggleTheme={toggleTheme} />
              <main className="main-content">
                <ClassSelection />
              </main>
            </>
          } />
          <Route path="/subject-selection" element={
            <>
              <Header theme={theme} toggleTheme={toggleTheme} />
              <main className="main-content">
                <SubjectSelection />
              </main>
            </>
          } />

          {/* Dashboard Routes */}
          <Route element={<DashboardLayout theme={theme} toggleTheme={toggleTheme} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/lessons" element={<MyLessons />} />
            {/* Placeholder routes for others */}
            <Route path="/ask-doubt" element={<AskDoubt />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/ai-insights" element={<AIInsights />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/resources" element={<Resources />} />
          </Route>

          <Route path="/login-alt" element={<AlternativeLogin theme={theme} toggleTheme={toggleTheme} />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
