import {FC, useContext, useState} from "react";
import './index.css'
import BlogSvg from '../../assets/blog_logo.svg';
import {themeSwitch} from "../../App";
import {useNavigate} from "react-router-dom";
import SwitchTheme from "@/components/SwitchTheme/SwitchTheme.tsx";
import {toast as sonnerToast} from "sonner";
import {Toaster} from "@/components/ui/sonner.tsx";
import {API_URL} from "@/utils/apis.ts";

const Login:FC = () => {
    const switchMS = useContext(themeSwitch)
    if (!switchMS) {
        throw new Error('themeSwitch context is not provided');
    }
    const navigate = useNavigate();
    interface loginListState {
        name:string,
        type:string,
        placeholder:string,
        value:string
    }
    const [boolClick,setBoolClick] = useState<boolean>(false);
    const [loginList,setLoginList] = useState<loginListState[]>(() => [
        {
            name: '用户名',
            type: 'text',
            placeholder: 'username',
            value: ''
        },
        {
            name: '密码',
            type: 'password',
            placeholder: 'password',
            value: ''
        },
    ]);

    const submitLogin = async () => {
        if (loginList[0].value && loginList[1].value) {
            try {
                const response = await fetch(API_URL+'/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: loginList[0].value,
                        password: loginList[1].value
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || '登录失败');
                }

                const data = await response.json();
                // console.log(data)
                localStorage.setItem('token', data.token);
                navigate('/home');
            } catch (error) {
                sonnerToast.error(
                    <div className={`select-none`}>
                        <p>账号密码错误！</p>
                    </div>
                );
            }
        }
        else {
            sonnerToast.error(
                <div className={`select-none`}>
                    <p>请输入完整的信息！</p>
                </div>
            );
        }
    }
    return (
        <div className=" relative flex justify-center items-center w-full h-full  overflow-hidden " style={{backgroundColor:'var(--dark-mode-foreground,#000)',transition:'background-color 0.5s'}}>
            <div className={`relative min-w-[400px] w-1/5 aspect-2-3 flex justify-center items-center`}>
                <div className={`${boolClick ? 'sLineIn' : 'sLineOut'} absolute z-950 h-2/3 border-r-1 border-gray-400 border-dashed`}></div>
                <div className={`${boolClick && 'moveLoginBoxLeft'} absolute login-container-top z-899`}>
                    <div className={`absolute z-900 w-1/10 aspect-1-1 top-5 left-5`}>
                        <SwitchTheme/>
                    </div>
                    <p className="mb-4 text-4xl font-bold gradient-text" style={{fontFamily:'Crystal-Medium-2'}}>Welcome Back!</p>
                    <p className="mb-15 text-1xl font-medium !opacity-90" style={{color:'var(--dark-mode-rearview,#fff)',transition:'color 0.5s'}}>欢迎来到Kyushu的门户网站，请先登录！</p>
                    <button className={`${boolClick ? 'btn2' : 'btn'}`}
                            onClick={()=> {setBoolClick(!boolClick)}}
                            disabled={boolClick} >START</button>
                    <img src={BlogSvg} alt="svg" className={`absolute w-30 bottom-40 loginSVG ${!boolClick && 'opacity-0'}`}/>
                </div>
                <div className={`${boolClick && 'moveLoginBoxRight'} absolute login-container-end `}>
                    <p className={`self-center text-3xl mb-5`}>登&emsp;录</p>
                    {loginList.map((item ,index) => (
                        <div key={index} className={`w-2/3 h-auto flex flex-col self-center mt-3 `} style={{color:'var(--dark-mode-foreground,#000)',transition:'color 0.5s'}}>
                            {/*<label htmlFor={item.name} className={`inputBoxLabel`}>{item.name}</label>*/}
                            <input type={item.type} name={item.name} placeholder={item.name} value={item.value} onChange={
                                (e):void => {
                                    setLoginList(
                                        loginList.map((currentItem, currentIndex) => {
                                            if (currentIndex === index) {
                                                return {
                                                    ...currentItem,
                                                    value: e.target.value
                                                };
                                            }
                                            return currentItem;
                                        })
                                    );
                                }
                            } className={`inputBox aspect-10-3`}/>
                        </div>
                    ))}
                    {/*<button className={`btn mt-20 self-center`} onClick={()=> submitLogin()}>LOGIN IN</button>*/}
                    <button className={`btn mt-20 self-center`} onClick={() => submitLogin()}>LOGIN IN</button>
                </div>
            </div>
            <Toaster />
            <div className={`absolute bottom-0 text-gray-500 text-[0.7rem] pb-6`}>
                <p className={`text-center`}>Copyright © 2025 G_Christine All rights reserved.</p>
                <p className={`text-center`}><a href="https://beian.miit.gov.cn" target={'_blank'}>冀 ICP 备 2025115205号-1</a></p>
            </div>
        </div>
    )
}

export default Login