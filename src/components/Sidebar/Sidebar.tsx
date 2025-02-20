import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import useStore from '../../store/Store';
import { getUsers } from '../../services/auth.srvice'; 

const Sidebar: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'chats' | 'contacts'>('chats');
    const { setActiveChat, chats, onlineUsers, userId, addChat } = useStore();
    const [allUsers, setAllUsers] = useState<string[]>([]);

    const handleTabChange = (tab: 'chats' | 'contacts') => {
        setActiveTab(tab);
    };

    const handleSelectChat = (chatId: string) => {
        setActiveChat(chatId);
        if (!chats.find(chat => chat.id === chatId)) {
            addChat(chatId, '');
        }
    };

    // Загрузка пользователей при монтировании компонента
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await getUsers(); // Предполагается наличие этой функции
                setAllUsers(users);
                localStorage.setItem('allUsers', JSON.stringify(users));
            } catch (error) {
                console.error("Ошибка при получении пользователей:", error); // Логирование ошибки
            }
        };
    
        fetchUsers();
    }, [addChat]);

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
                <div className="scrollChat scrollable-content">
                    <ul className="chat-list">
                        {chats.map(chat => (
                            <li 
                                className="chat-item" 
                                key={chat.id} 
                                onClick={() => handleSelectChat(chat.id)}
                            >
                                <div className="contact-name">{chat.id}</div>
                                <div className="last-message">{chat.lastMessage}</div>
                                {onlineUsers.includes(chat.id) && <div className="online-status">Online</div>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {activeTab === 'contacts' && (
                <div className="scrollContact scrollable-content">
                    <ul className="contact-list">
                        {allUsers.filter(onlineUser => onlineUser !== userId && onlineUser).map(contact => (
                            <li
                                className="contact-item"
                                key={contact} // Убедитесь, что contact уникален
                                onClick={() => handleSelectChat(contact)}
                            >
                                {contact}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
