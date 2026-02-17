import React from 'react';
import { Play, CheckCircle, Clock } from 'lucide-react';
import Button from './ui/Button';
import './LessonCard.css';

const LessonCard = ({ lesson }) => {
    const {
        title,
        subject,
        chapter,
        duration,
        progress,
        status,
        icon: Icon,
        color,
        bg
    } = lesson;

    return (
        <div className="lesson-card-item">
            {/* Top Row: Icon and Meta */}
            <div className="card-top-row">
                <div className={`lesson-icon-large ${bg}`}>
                    <Icon size={28} className={color} />
                </div>
                <div className="card-header-info">
                    <span className={`lesson-tag ${color.replace('text-', 'tag-text-')}`}>{subject}</span>
                    <span className="lesson-chapter">Chapter {chapter}</span>
                </div>
            </div>

            {/* Title */}
            <h3 className="lesson-item-title">{title}</h3>

            {/* Footer Row: Time and Action */}
            <div className="card-footer-row">
                <div className="lesson-time">
                    <Clock size={16} />
                    <span>{duration}</span>
                </div>

                <div className="lesson-action-area">
                    {status === 'Completed' ? (
                        <div className="status-completed">
                            <CheckCircle size={14} />
                            <span>Done</span>
                        </div>
                    ) : (
                        <div className="status-progress-wrapper">
                            <div className="progress-bar-bg-xs">
                                <div
                                    className="progress-bar-fill-xs"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <span className="sc-progress-text">{progress}%</span>
                        </div>
                    )}

                    <Button
                        variant={status === 'Completed' ? 'outline' : 'primary'}
                        size="sm"
                        className="w-full"
                    >
                        {status === 'Completed' ? 'Review' : (progress > 0 ? 'Resume' : 'Start')}
                        {status !== 'Completed' && <Play size={14} fill="white" className="ml-1" />}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LessonCard;
