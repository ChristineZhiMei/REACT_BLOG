import {FC, createContext, useState, useLayoutEffect, useEffect} from "react";
import { RouterProvider} from 'react-router-dom';
import createRouter from './router';
import {ThemeProvider} from "@/components/theme-provider"
import './App.css'
import * as React from "react";
import { Payment } from "@/page/Settings/components/payments/columns.tsx";
import {getUserInfo, User} from "@/utils/apis.ts";
const accessListDe: Payment[] = [
    {
        title:"BiliBili",
        url:"https://www.bilibili.com/",
        classification:"视频",
        describe:"B站大学"
    },
    {
        title:"百度翻译",
        url:"https://fanyi.baidu.com/",
        classification:"工具",
        describe:"翻译工具"
    },
    {
        title:"力扣",
        url:"https://leetcode.cn/",
        classification:"算法",
        describe:"算法练习"
    },
    {
        title:"Vue",
        url:"https://v2.cn.vuejs.org/v2/guide/",
        classification:"前端",
        describe:"UI框架"
    },
    {
        title:"React",
        url:"https://react.docschina.org/",
        classification:"前端",
        describe:"UI框架"
    },
    {
        title:"React Native",
        url:"https://reactnative.cn/",
        classification:"前端",
        describe:"构建Android和iOS应用的框架"
    },
    {
        title:"Tailwindcss",
        url:"https://tailwind.docs.73zls.com/",
        classification:"前端",
        describe:"快速编写css"
    },
    {
        title:"vite",
        url:"https://vitejs.cn/vite3-cn/guide/",
        classification:"前端",
        describe:"前端工具链"
    },
    {
        title:"shadcn/ui",
        url:"https://www.shadcn.com.cn/",
        classification:"前端",
        describe:"react组件库"
    },
    {
        title:"lucide",
        url:"https://lucide.dev/",
        classification:"前端",
        describe:"图标库"
    },
    {
        title:"即时设计",
        url:"https://js.design/",
        classification:"前端",
        describe:"UI设计工具"
    },
    {
        title:"electron",
        url:"https://www.electronjs.org/zh/docs/latest/",
        classification:"前端",
        describe:"构建桌面应用的框架"
    },
    {
        title:"webpack",
        url:"https://www.webpackjs.com/",
        classification:"前端",
        describe:"js打包工具"
    },
    {
        title:"中国色",
        url:"https://www.zhongguose.com/#bohelv/",
        classification:"前端",
        describe:"中国色色卡"
    },
    {
        title:"Django菜鸟教程",
        url:"https://www.runoob.com/django/django-tutorial.html",
        classification:"后端",
        describe:"用于构建 Web 应用程序的高级 Python Web 框架"
    },
    {
        title:"豆包",
        url:"https://www.doubao.com/chat/?from_logout=1",
        classification:"工具",
        describe:"AI"
    },
    {
        title:"DeepSeek",
        url:"https://chat.deepseek.com/",
        classification:"工具",
        describe:"AI"
    },
    {
        title:"DeepSeek",
        url:"https://chat.deepseek.com/",
        classification:"工具",
        describe:"AI"
    },
]
type ThemeSwitchContextType = {
    SwitchMSBool: boolean;
    setSwitchMSBool: React.Dispatch<React.SetStateAction<boolean>>;
    dataList: Payment[];
    setDataList: (newData:Payment[])=>void;
    userList:User;
    setUserList:(newUser:User)=>void;
    refreshUser: () => void; // 新增刷新方法
};

const themeSwitch = createContext<ThemeSwitchContextType | null>(null);
const App: FC = () => {
    const [refreshCount, setRefreshCount] = useState(0)
    // 使用函数式初始化，在组件挂载时从 localStorage 读取主题信息
    const [SwitchMSBool, setSwitchMSBool] = useState<boolean>(() => {
        const storedTheme = localStorage.getItem('myTheme');
        return storedTheme ? storedTheme === 'true' : false;
    });

    const [dataList, setDataList] = useState<Payment[]>(accessListDe);
    const [userList,setUserList] = useState<User>({
        avatar:'',
        email:'',
        name: '',
        github:'',
        id:-1,
        introduction:''
    });
    useEffect(() => {
        getUserInfo()
            .then(user => {
                console.log(user);
                if (user?.userInfo.accessList) setDataList(user?.userInfo.accessList)
                if (user){
                    setUserList({
                        ...userList,
                        avatar:user?.userInfo.avatar,
                        email:user?.userInfo.email,
                        name: user?.userInfo.name,
                        github: user?.userInfo.github,
                        id: user?.userInfo.id,
                        introduction: user?.userInfo.introduction
                    });
                }
                console.log(user?.userInfo)
            })
            .catch(() => {
                setDataList(accessListDe)
                setUserList({
                    ...userList,
                    avatar:"",
                    email:"",
                    name: "",
                    github: "",
                    id: -1,
                    introduction: ""
                })
            });
    },[refreshCount]);

    const switchMS: ThemeSwitchContextType = {
        SwitchMSBool,
        setSwitchMSBool,
        dataList,
        setDataList,
        userList,
        setUserList,
        refreshUser: () => setRefreshCount(c => c + 1) // 暴露刷新方法
    };
    useLayoutEffect(() => {
        if (SwitchMSBool) {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
        // 每次主题变化时更新 localStorage
        localStorage.setItem('myTheme', SwitchMSBool.toString());
    }, [SwitchMSBool]);

    const router = createRouter();

    return (
        <ThemeProvider defaultTheme={'dark'} storageKey="vite-ui-theme">
            <div className={`relative w-full h-full overflow-x-hidden`}>
                <themeSwitch.Provider value={switchMS}>
                    <RouterProvider router={router}/>
                </themeSwitch.Provider>
            </div>
        </ThemeProvider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export { themeSwitch }
export default App;