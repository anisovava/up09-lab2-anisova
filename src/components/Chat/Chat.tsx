// src/components/ChatArea.tsx
import React from 'react';
import './Chat.css'; // Импортируем стили

const Chat: React.FC = () => {
    return (
        <div className="chat-area">
            <div className="chat-header">
                <h2>Пользователь 1</h2> {/* Отображаем имя пользователя */}
            </div>
            <div className="messages">
                {/* Статические сообщения */}
                <div className="message left">Привет! Как дела?</div>
               

                {/* Ваши сообщения */}
                <div className="message right">Все отлично, спасибо!</div> 
                
                <div className="message left">Что нового?</div>
                
                <div className="message right">Работаю над проектом.</div>
            </div>
            <div className="input-area">
                <input type="text" placeholder="Введите сообщение..." />
                <button>Отправить</button>
            </div>
        </div>
    );
};

export default Chat;
