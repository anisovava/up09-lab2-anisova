import { create } from 'zustand';
import { Message } from "../models/message.model";

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
