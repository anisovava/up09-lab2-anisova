// src/components/Sidebar.tsx
import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import useStore from '../../store/Store';

const Sidebar: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'chats' | 'contacts'>('chats');
    const { setActiveChat, chats, onlineUsers, userId } = useStore();
    const [allUsers, setAllUsers] = useState<string[]>([]);

    const handleTabChange = (tab: 'chats' | 'contacts') => {
        setActiveTab(tab);
    };

    const handleSelectChat = (chatId: string) => {
        setActiveChat(chatId);
    };

    useEffect(() => {
        
        const storedUsers = localStorage.getItem('allUsers');
        if (storedUsers) {
            setAllUsers(JSON.parse(storedUsers));
        }
    }, []);


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
                    {chats.map(chat => (
                        <li className="chat-item" key={chat.id} onClick={() => handleSelectChat(chat.id)}>
                            <div className="contact-name">{chat.id}</div>
                            <div className="last-message">{chat.lastMessage}</div>
                            {onlineUsers.includes(chat.id) && <div className="online-status">Online</div>}
                        </li>
                    ))}
                </ul>
            )}

            {activeTab === 'contacts' && (
                <ul className="contact-list">
                    {allUsers.filter(onlineUser => onlineUser !== userId).map(contact => ( 
                        <li className="contact-item" key={contact}>{contact}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Sidebar
