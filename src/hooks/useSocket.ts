import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import useStore from '../store/Store';
import { Message } from "../models/message.model";

const API_BASE_URL = 'https://api.ktkv.dev';

const useSocket = () => {
    const { setOnlineUsers, addMessage, userId } = useStore();

    useEffect(() => {
        const socket: Socket = io(API_BASE_URL);

        socket.on('connect', () => {
            console.log('Connected to WebSocket');
        });

        socket.on('users', (users) => {
            console.log('Online users:', users);
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
    }, [setOnlineUsers, addMessage, userId]);
};

export default useSocket;
