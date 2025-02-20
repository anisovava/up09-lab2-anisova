// Authentication.tsx
import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { URLs } from "../../app/router/router.urls"
import useStore from "../../store/Store";

const Authentication = () => {
    const { userId, setUserId } = useStore(state => state); // Добавляем setUserId из store
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId'); // Проверяем наличие userId в localStorage

        if (storedUserId) {
            setUserId(storedUserId); // Устанавливаем userId из localStorage в store
            // navigate(URLs.CHAT); // Перенаправляем на главную страницу
        }
        if (!storedUserId) {
            navigate(URLs.LOGIN)
        }
    }, [userId, navigate, setUserId]);

    return (
        <Outlet />
    )
}

export default Authentication
