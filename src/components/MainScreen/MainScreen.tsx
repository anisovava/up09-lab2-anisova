// src/components/ChatScreen.tsx
import React from 'react';
import './Main.css';
import Sidebar from '../Sidebar/Sidebar';
import Chat from '../Chat/Chat'

const MainScreen: React.FC = () => {
  return (
    <div className="chat-screen">
           <Sidebar />
          
           <Chat />
        </div>
  );
};

export default MainScreen;