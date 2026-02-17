import React, { useState } from 'react';
import { Book, Globe, Sun, Moon } from 'lucide-react';
import Button from './ui/Button';
import './Header.css';

const Header = ({ theme, toggleTheme }) => {
    const [language, setLanguage] = useState('Hindi');
    const [isLangOpen, setIsLangOpen] = useState(false);

    const languages = ['English', 'Hindi', 'Kannada'];

    const toggleLangMenu = () => setIsLangOpen(!isLangOpen);
    const selectLanguage = (lang) => {
        setLanguage(lang);
        setIsLangOpen(false);
    };

    return (
        <header className="header">
            <div className="header-logo-container">
                <div className="logo-icon-wrapper">
                    <Book className="logo-icon" />
                </div>
                <span className="header-title">
                    PathShalaAI
                </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="outline" size="sm" onClick={toggleTheme}>
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </Button>
                <div style={{ position: 'relative' }}>
                    <Button variant="outline" size="sm" className="gap-2" onClick={toggleLangMenu}>
                        <Globe size={16} />
                        {language}
                    </Button>
                    {isLangOpen && (
                        <div className="language-dropdown">
                            {languages.map(lang => (
                                <div
                                    key={lang}
                                    className="lang-option"
                                    onClick={() => selectLanguage(lang)}
                                >
                                    {lang}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
