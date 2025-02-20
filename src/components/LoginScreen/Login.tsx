// src/components/LoginScreen.tsx
import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/Store';
import { loginUser } from '../../services/auth.srvice';
import { URLs } from '../../app/router/router.urls';



    const Login: React.FC = () => {
        const [userId, setUserId] = useState<string>('');
        const [error, setError] = useState<string | null>(null);
        const navigate = useNavigate();
        const { setUserId: setStoreUserId} = useStore();
        const handleLogin = async () => {
            try{
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
