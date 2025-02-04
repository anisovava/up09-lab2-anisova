// src/components/LoginScreen.tsx
import React, { useState } from 'react';
import './Login.css';
//import { useNavigate } from 'react-router-dom';



    const Login: React.FC = () => {
        const [userId, setUserId] = useState<string>('');
    
        const handleLogin = () => {
            if (userId.trim()) {
               
            }
        };
    

    return (
        <>
        <div className="login-screen">
            <h1>Вход в чат</h1>
            <input 
                type="text" 
                value={userId} 
                onChange={(e) => setUserId(e.target.value)} 
                placeholder="Введите уникальный ID" 
            />
            <button onClick={handleLogin}>Войти в чат</button>
        </div>
        </>
    );
};

export default Login;
