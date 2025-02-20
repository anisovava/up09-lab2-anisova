# React + TypeScript + Vite

## Работа в Codespace

Хорошо, давайте интегрируем все части, чтобы создать полноценное веб-приложение чата с использованием React, TypeScript, Zustand, Socket.IO и Axios. Я предоставлю вам обновленный код для каждого компонента и объясню, как все это работает вместе.





**1. Структура проекта**

```
react-typescript-chat-app/
├── src/
│   ├── components/
│   │   ├── Authentication/
│   │   │   └── Authentication.tsx
│   │   ├── Chat/
│   │   │   └── Chat.tsx
│   │   │   └── Chat.css
│   │   ├── LoginScreen/
│   │   │   └── Login.tsx
│   │   │   └── Login.css
│   │   ├── MainScreen/
│   │   │   └── MainScreen.tsx
│   │   │   └── Main.css
│   │   ├── Sidebar/
│   │   │   └── Sidebar.tsx
│   │   │   └── Sidebar.css
│   ├── app/
│   │   ├── router/
│   │   │   ├── router.tsx
│   │   │   └── router.urls.ts
│   ├── hooks/
│   │   └── useSocket.ts
│   ├── models/
│   │   └── message.model.ts
│   ├── services/
│   │   └── auth.service.ts
│   ├── store/
│   │   └── store.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── ...
├── public/
├── server/
│   └── server.js
├── package.json
├── tsconfig.json
└── ...
```

**2. `router.urls.ts`**

```ts
export const URLs = {
    LOGIN: '/login',
    CHAT: '/chat'
}
```

**3. `store/store.ts`**

```ts
import { create } from 'zustand'
import {Message} from "../models/message.model";

interface Chat {
    id: string;
    lastMessage: string;
}

interface UserState {
    userId: string | null;
    activeChat: string | null;
    chats: Chat[];
    messages: { [chatId: string]: Message[] };
    onlineUsers: string[];
    setUserId: (id: string) => void;
    setActiveChat: (chatId: string) => void;
    addChat: (chatId: string, lastMessage: string) => void;
    addMessage: (chatId: string, message: Message) => void;
    setOnlineUsers: (users: string[]) => void;
}

const useStore = create<UserState>((set, get) => ({
    userId: null,
    activeChat: null,
    chats: [],
    messages: {},
    onlineUsers: [],
    setUserId: (id: string) => set({ userId: id }),
    setActiveChat: (chatId: string) => set({ activeChat: chatId }),
    addChat: (chatId: string, lastMessage: string) => set(state => ({
        chats: [...state.chats, { id: chatId, lastMessage }]
    })),
    addMessage: (chatId: string, message: Message) => set(state => ({
        messages: {
            ...state.messages,
            [chatId]: [...(state.messages[chatId] || []), message]
        }
    })),
    setOnlineUsers: (users: string[]) => set({ onlineUsers: users }),
}));

export default useStore;
```

**4. `models/message.model.ts`**

```ts
export interface Message {
    id: string;
    from: string;
    to: string;
    message: string;
    timestamp: string;
}
```

**5. `services/auth.service.ts`**

```ts
import axios from 'axios';

const API_BASE_URL = 'http://82.147.71.186:3000';

export const loginUser = async (id: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, { id });
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || error.message;
    }
};

export const getMessages = async (id: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/messages/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || error.message;
    }
};
```

**6. `hooks/useSocket.ts`**

```ts
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import useStore from '../store/store';
import {Message} from "../models/message.model";

const API_BASE_URL = 'http://82.147.71.186:3000';

const useSocket = () => {
    const { setOnlineUsers, setUserId, addMessage, userId } = useStore();
    useEffect(() => {
        const socket: Socket = io(API_BASE_URL);

        socket.on('connect', () => {
            console.log('Connected to WebSocket');
        });

        socket.on('users', (users) => {
            setOnlineUsers(users.map((user: any) => user.id));
        });

        socket.on('private_message', (message: Message) => {
            console.log('Private message received:', message);
            addMessage(message.from === userId ? message.to : message.from, message);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket');
        });

        if (userId) {
            socket.emit('register', userId);
        }

        return () => {
            socket.off('connect');
            socket.off('users');
            socket.off('private_message');
            socket.off('disconnect');

            socket.disconnect();
        };
    }, [setOnlineUsers, setUserId, addMessage, userId]);
};

export default useSocket;
```

**7. `components/LoginScreen/Login.tsx`**

```tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/store';
import { loginUser } from '../../services/auth.service';
import { URLs } from '../../app/router/router.urls';
import './Login.css';

const Login: React.FC = () => {
    const [userId, setUserId] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { setUserId: setStoreUserId } = useStore();

    const handleLogin = async () => {
        try {
            const user = await loginUser(userId);
            setStoreUserId(user.id);
            navigate(URLs.CHAT);
        } catch (e: any) {
            setError(e);
        }
    };

    return (
        <div className="login-screen">
            <h1>Вход в чат</h1>
            {error && <div className="error-message">{error}</div>}
            <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Введите уникальный ID"
            />
            <button onClick={handleLogin}>Войти в чат</button>
        </div>
    );
};

export default Login;
```

**8. `components/Authentication/Authentication.tsx`**

```tsx
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useStore from "../../store/store";
import { URLs } from "../../app/router/router.urls";
const Authentication = () => {
    const { userId } = useStore(state => state);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            navigate(URLs.LOGIN);
        }
    }, [userId, navigate]);

    return (
        <Outlet />
    )
}
export default Authentication
```

**9. `components/MainScreen/MainScreen.tsx`**

```tsx
import React from 'react';
import './Main.css';
import Sidebar from '../Sidebar/Sidebar';
import Chat from '../Chat/Chat';
import useSocket from '../../hooks/useSocket';

const MainScreen: React.FC = () => {
    useSocket();

    return (
        <div className="chat-screen">
            <Sidebar />
            <Chat />
        </div>
    );
};

export default MainScreen;
```

**10. `components/Sidebar/Sidebar.tsx`**

```tsx
import React, { useState } from 'react';
import './Sidebar.css';
import useStore from '../../store/store';

const Sidebar: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'chats' | 'contacts'>('chats');
    const { setActiveChat, chats, onlineUsers, userId } = useStore();

    const handleTabChange = (tab: 'chats' | 'contacts') => {
        setActiveTab(tab);
    };

    const handleSelectChat = (chatId: string) => {
        setActiveChat(chatId);
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
                    {onlineUsers.filter(onlineUser => onlineUser !== userId).map(contact => (
                        <li className="contact-item" key={contact}>{contact}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Sidebar;
```

**11. `components/Chat/Chat.tsx`**

```tsx
import React, { useState } from 'react';
import './Chat.css';
import useStore from '../../store/store';
import {Message} from "../../models/message.model";
import { io } from 'socket.io-client';

const API_BASE_URL = 'http://82.147.71.186:3000';

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
```

**12. `app/router/router.tsx`**

```tsx
import { createBrowserRouter } from "react-router-dom";
import Login from '../../components/LoginScreen/Login';
import MainScreen from '../../components/MainScreen/MainScreen';
import Authentication from "../../components/Authentication/Authentication";
import { URLs } from "./router.urls";

const router = createBrowserRouter([
    {
        path: URLs.LOGIN,
        element: <Login />,
    },
    {
        path: "/",
        element: <Authentication />,
        children: [
            {
                path: URLs.CHAT,
                element: <MainScreen />
            }
        ]
    },
]);

export default router;
```

**13. `App.tsx`**

```tsx
import React from 'react';
import { RouterProvider } from "react-router-dom";
import router from './app/router/router';

function App() {
    return <RouterProvider router={router} />;
}

export default App;
```

**14. `server/server.js`**

```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // Allow requests from this origin
        methods: ["GET", "POST"],
        credentials: true
    }
});

const users = {};
const messages = []; // Store messages globally

app.use(cors({
    origin: "*", // Allow requests from this origin
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(express.json());

// Register or authorize user
app.post('/login', (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).send('User ID is required');
    }
    if (!users[id]) {
        users[id] = { id };
        console.log(`New user registered: ${id}`);
    } else {
        console.log(`User authorized: ${id}`);
    }
    res.status(200).send(users[id]);
});

// Get message history for a user
app.get('/messages/:id', (req, res) => {
    const { id } = req.params;
    const userMessages = messages.filter(msg => msg.from === id || msg.to === id);
    res.status(200).send(userMessages);
});

// WebSocket connection
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('register', (id) => {
        socket.userId = id; // Store the user ID in the socket object
        if (!users[id]) {
            users[id] = { id, socketId: socket.id };
            console.log(`User registered with socket: ${id}`);
        } else {
            users[id].socketId = socket.id;
            console.log(`User reconnected with socket: ${id}`);
        }
        io.emit('users', Object.values(users)); // Emit the list of users to all clients
    });

    socket.on('private_message', (data) => {
        const { to, message } = data;
        const recipient = users[to];
        const timestamp = new Date().toISOString();
        if (recipient && recipient.socketId) {
            io.to(recipient.socketId).emit('private_message', { from: socket.userId, to, message, timestamp });
            console.log(`Message from ${socket.userId} to ${recipient.id}: ${message}`);
            // Store message in history
            messages.push({ from: socket.userId, to, message, timestamp });
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        // Remove the user from the list
        for (const id in users) {
            if (users[id].socketId === socket.id) {
                delete users[id];
                break;
            }
        }
        io.emit('users', Object.values(users)); // Emit the updated list of users to all clients
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```

**Основные моменты:**

*   **Состояние (Zustand):** `store.ts` управляет идентификатором пользователя, активным чатом, чатами и сообщениями.
*   **API взаимодействие (Axios):** `auth.service.ts` использует Axios для отправки идентификатора пользователя и получения истории сообщений.
*   **WebSocket (Socket.IO):** `useSocket.ts` регистрирует пользователя, получает список пользователей и отправляет/получает сообщения.
*   **Аутентификация:** Компонент `Authentication` защищает маршрут чата и перенаправляет на страницу входа, если пользователь не аутентифицирован.
*   **Индикация активности пользователя:** Боковая панель отображает онлайн-статус пользователей.
*   **Сообщения в реальном времени:** Поддерживается отправка сообщений в реальном времени.

Теперь у вас есть законченное веб-приложение чата со всеми необходимыми функциями. Не забудьте запустить серверную часть (`node server.js`) и клиентскую часть (`npm start`) отдельно.

Citations:
[1] https://github.com/michaelparkadze/react-typescript-chat-app
[2] https://joshmo.hashnode.dev/building-deploying-a-chat-app-with-react-typescript-rust
[3] https://www.youtube.com/watch?v=areCZcr-XZ4
[4] https://dev.to/killianfrappartdev/instant-messaging-app-made-with-react-typescript-node-socket-io-27pc
[5] https://mihail-gaberov.eu/how-i-build-chat-app-with-react-and-typescript-part4/
[6] https://github.com/Soma-Ikeda/react-typescript-chat
[7] https://mihail-gaberov.eu/how-i-build-chat-app-with-react-and-typescript-part1/

---
Answer from Perplexity: https://www.perplexity.ai/search/dopishi-etot-kod-imia-eti-treb-j_Yk33WvRrixGsP.daAj.Q?utm_source=copy_output
