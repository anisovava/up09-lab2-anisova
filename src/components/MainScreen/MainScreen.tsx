// src/components/ChatScreen.tsx
import React from 'react';
import './Main.css';
import Sidebar from '../Sidebar/Sidebar';
import Chat from '../Chat/Chat'
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