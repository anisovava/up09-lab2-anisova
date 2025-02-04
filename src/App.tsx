
import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './components/LoginScreen/Login';
import MainScreen from './components/MainScreen/MainScreen';
import router from './app/router/router';



function App(){
    return <RouterProvider router={router} />;
}

export default App;
