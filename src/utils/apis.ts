/*用户账户相关接口*/
// import {Payment} from "@/page/Settings/components/payments/columns.tsx";
import {redirect} from "react-router-dom";

// export type UserInfo = {
//     avatar:string;
//     email: string;
//     name: string;
//     github: string;
//     id: number;
//     introduction: string;
//     accessList:Payment[];
// }
export const API_URL = 'http://8.152.200.162:20029'
// export const API_URL = 'http://127.0.0.1:20029'
export type User = {
    avatar:string;
    email: string;
    name: string;
    github: string;
    id: number;
    introduction: string;
}
async function getUserInfo() {
    const token = localStorage.getItem('token');
    if (!token) return redirect('/login');
    try {
        const response = await fetch(API_URL+'/vip', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const responseData = await response.json();
        if (!response.ok) throw new Error('Token expired');
        return responseData;
    } catch (error) {
        localStorage.removeItem('token');
        console.error(error);
        return redirect('/login');
    }
}
export {
    getUserInfo
}
