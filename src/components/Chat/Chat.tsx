import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import useStore from '../../store/Store';
import { Message } from "../../models/message.model";
import { nanoid } from 'nanoid';
import { io, Socket } from 'socket.io-client';
import { getMessages } from '../../services/auth.srvice';

const API_BASE_URL = 'https://api.ktkv.dev';

const Chat: React.FC = () => {
    const { activeChat, messages, userId, addMessage, setActiveChat } = useStore();
    const [messageText, setMessageText] = useState('');
    const [socket, setSocket] = useState<undefined | Socket>(undefined);

    const sendMessage = () => {
        if (!activeChat || !messageText || !userId) return;

        const messageData: Message = {
            from: userId,
            to: activeChat,
            message: messageText,
        };

        socket && socket.emit('private_message', messageData);
        addMessage(activeChat, messageData);
        setMessageText('');
    };

    // Загрузка сообщений при выборе чата
    useEffect(() => {
        if (activeChat) {
            const fetchMessages = async () => {
                try {
                    const fetchedMessages = await getMessages(activeChat);
                    fetchedMessages.forEach((msg: Message) => addMessage(activeChat, msg));
                } catch (error) {
                    console.error("Ошибка при получении сообщений:", error);
                }
            };
            fetchMessages();
        }
    }, [activeChat, addMessage]);

    useEffect(() => {
        setSocket(io(API_BASE_URL));
        return () => {
            socket && socket.disconnect();
        };
    }, []);

    return (
        <div className="chat-area">
            <div className="chat-header">
                <h2>{activeChat || 'Выберите чат'}</h2>
            </div>
            <div className="messages">
                {messages[activeChat!]?.map((msg: Message) => (
                    <div key={nanoid()} className={`message ${msg.from === userId ? 'right' : 'left'}`}>
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
