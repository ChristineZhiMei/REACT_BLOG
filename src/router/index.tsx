import {createHashRouter, Navigate , redirect} from 'react-router-dom';
import Login from '../page/Login';
import Home from '../page/Home';
import Settings from '../page/Settings';
import AccountInformation from '@/page/Settings/components/AccountInformation';
import Feedback from '@/page/Settings/components/Feedback';
import QuickAccess from '@/page/Settings/components/payments/QuickAccess.tsx';
import {API_URL} from "@/utils/apis.ts";

async function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) return redirect('/login');

    try {
        const response = await fetch(API_URL + '/vip', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Token expired');
    } catch (error) {
        localStorage.removeItem('token');
        console.error(error);
        return redirect('/login');
    }
}
export default function createRouter() {
    return createHashRouter([
        {
            path: '/',
            loader: checkAuth,
            children:[
                {
                    index: true,  // 添加根路径默认跳转
                    element: <Navigate to="/home" replace />
                },
                {
                    path: '/home',
                    element: <Home/>,

                },
                {
                    path: '/settings',
                    element: <Settings />,
                    children: [
                        {
                            index: true,
                            element: <Navigate to="/settings/account"/>,
                        },
                        {
                            path: '/settings/account',
                            element: <AccountInformation/>,
                        },
                        {
                            path: '/settings/feedback',
                            element: <Feedback/>,
                        },
                        {
                            path: '/settings/quickAccess',
                            element: <QuickAccess/>,
                        }
                    ]
                }
            ]
        },
        {
            path: '/login',
            element: <Login/>,
        }
    ]);
}