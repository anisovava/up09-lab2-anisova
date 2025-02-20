import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import useStore from '../store/Store';
import {Message} from "../models/message.model";

const API_BASE_URL = 'https://api.ktkv.dev';

const useSocket = () => {
    const { setOnlineUsers, setUserId, addMessage, userId } = useStore();

    useEffect(() => {
        const socket: Socket = io(API_BASE_URL);

       
        const getAllUsers = () => {
            const storedUsers = localStorage.getItem('allUsers');
            return storedUsers ? JSON.parse(storedUsers) : [];
        };

        const setAllUsers = (users: string[]) => {
            localStorage.setItem('allUsers', JSON.stringify(users));
        };

        socket.on('connect', () => {
            console.log('Connected to WebSocket');
        });

        socket.on('users', (users) => {
            setOnlineUsers(users.map((user: any) => user.id));

           
            const onlineUserIds = users.map((user: any) => user.id);
            const allUsers = getAllUsers();
            const newUsers = onlineUserIds.filter(id => !allUsers.includes(id)); // Добавляем только новых
            if (newUsers.length > 0) {
                setAllUsers([...allUsers, ...newUsers]);
            }
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
