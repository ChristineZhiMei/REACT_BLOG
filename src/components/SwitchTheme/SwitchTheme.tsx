import {FC, useLayoutEffect, useState} from "react";
import SwitchSunSvg from "@/assets/SolarSunBroken.svg";
import SwitchMoonSvg from "@/assets/SolarMoonBroken.svg";
import './index.css'
import { useTheme } from "@/components/theme-provider";

const SwitchTheme:FC = () => {
    const { setTheme } = useTheme()
    const [SwitchMSBool, setSwitchMSBool] = useState<boolean>(() => {
        const storedTheme = localStorage.getItem('myTheme');
        return storedTheme ? storedTheme === 'true' : false;
    });
    useLayoutEffect(() => {
        if (SwitchMSBool) {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
        // 每次主题变化时更新 localStorage
        localStorage.setItem('myTheme', SwitchMSBool.toString());
    }, [SwitchMSBool]);
    return(
        <div className={`w-full h-full`}>
            <div className={`w-full aspect-1-1 cursor-pointer select-none`} onClick={()=> {
                setTheme(!SwitchMSBool ? 'light' : 'dark')
                setSwitchMSBool(!SwitchMSBool)
            }}>
                <img src={SwitchSunSvg} alt="" className={`w-full h-full absolute SwitchSunMoonlight ${SwitchMSBool ? 'SwitchMS' : 'SwitchSS'}`} />
                <img src={SwitchMoonSvg} alt="" className={`w-full h-full absolute SwitchSunMoon ${!SwitchMSBool ? 'SwitchMS' : 'SwitchSS'}`} />
            </div>
        </div>
    )
}
export default SwitchTheme;