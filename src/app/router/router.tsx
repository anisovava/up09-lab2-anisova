import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
                "path": URLs.CHAT,
                element: <MainScreen />
            }
        ]
    },
     ]);

export default router;