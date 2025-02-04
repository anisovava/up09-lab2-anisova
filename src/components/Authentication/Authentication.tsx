import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { URLs } from "../../app/router/router.urls"

const Authentication = () => {
    // const {userId} = useStore(state => state)
    const navigate = useNavigate()

    const userId = true

    useEffect(() => {
        if (!userId) {
            // Отправить пользователя на "/login"
            navigate(URLs.LOGIN)
        }
    }, [])

    return (
        <Outlet />
    )
}

export default Authentication