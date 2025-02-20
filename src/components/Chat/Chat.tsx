import React, { useState } from 'react';
import './Chat.css';
import useStore from '../../store/Store';
import {Message} from "../../models/message.model";
import { io } from 'socket.io-client';

const API_BASE_URL = 'https://api.ktkv.dev';

const Chat: React.FC = () => {
    const { activeChat, messages, userId, addMessage } = useStore();
    const [messageText, setMessageText] = useState('');

    const socket = io(API_BASE_URL);

     const sendMessage = () => {
         if (!activeChat || !messageText) return;

         const messageData = {
             to: activeChat,
             message: messageText,
         };

         socket.emit('private_message', messageData);
         setMessageText('');
     };

    return (
        <div className="chat-area">
            <div className="chat-header">
                <h2>{activeChat || 'Выберите чат'}</h2>
            </div>
            <div className="messages">
                {messages[activeChat!]?.map((msg: Message) => (
                    <div key={msg.id} className={`message ${msg.from === userId ? 'right' : 'left'}`}>
                        {msg.message}
                    </div>
                ))}
            </div>
            <div className="input-area">
                <input
                    type="text"
                    placeholder="Введите сообщение..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                />
                <button onClick={sendMessage}>Отправить</button>
            </div>
        </div>
    );
};

export default Chat;