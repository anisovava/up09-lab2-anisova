// src/components/Sidebar.tsx
import React, { useState } from 'react';
import './Sidebar.css'; // Импортируем стили

interface SidebarProps {
    onSelectChat: (chatId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectChat }) => {
    const [activeTab, setActiveTab] = useState<'chats' | 'contacts'>('chats');

    const handleTabChange = (tab: 'chats' | 'contacts') => {
        setActiveTab(tab);
    };

    return (
        <div className="sidebar">
            <div className="tabs">
                <button 
                    className={`tab ${activeTab === 'chats' ? 'active' : ''}`} 
                    onClick={() => handleTabChange('chats')}
                >
                    Чаты
                </button>
                <button 
                    className={`tab ${activeTab === 'contacts' ? 'active' : ''}`} 
                    onClick={() => handleTabChange('contacts')}
                >
                    Контакты
                </button>
            </div>

            {activeTab === 'chats' && (
                <ul className="chat-list">
                    <li className="chat-item" onClick={() => onSelectChat('Контакт 1')}>
                        <div className="contact-name">Контакт 1</div>
                        <div className="last-message">Последнее сообщение 1</div>
                    </li>
                    <li className="chat-item" onClick={() => onSelectChat('Контакт 2')}>
                        <div className="contact-name">Контакт 2</div>
                        <div className="last-message">Последнее сообщение 2</div>
                    </li>
                    <li className="chat-item" onClick={() => onSelectChat('Контакт 3')}>
                        <div className="contact-name">Контакт 3</div>
                        <div className="last-message">Последнее сообщение 3</div>
                    </li>
                </ul>
            )}

            {activeTab === 'contacts' && (
                <ul className="contact-list">
                    <li className="contact-item">Пользователь 1</li>
                    <li className="contact-item">Пользователь 2</li>
                    <li className="contact-item">Пользователь 3</li>
                </ul>
            )}
        </div>
    );
};

export default Sidebar;
