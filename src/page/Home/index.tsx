import {FC, useContext, useEffect, useState} from "react";
import Navigation from '../../components/Navigation/Navigation.tsx'
import PointBalls from "../../components/PointBalls/PointBalls.tsx";
import GetDate from "../../components/GetDate/GetDate.tsx";
import SwitchCards from "./components/SwitchCards/SwitchCards.tsx";
import {themeSwitch} from "@/App.tsx";
const Home:FC = () => {
    const [HomeListPage,getHomeListPage] = useState<number>(0)
    const switchMS = useContext(themeSwitch)
    useEffect(() => {
        switchMS?.refreshUser()
    }, []);
    return (
        <div className={`w-full h-full`}>
            <Navigation/>
            <div className={`w-full h-full fixed top-0 left-0 z-0`}  style={{backgroundColor:'var(--dark-mode-foreground,#000)',color:'var(--dark-mode-rearview,#fff)',transition:'background-color 0.5s'}}></div>
            <div className={`w-full h-full absolute z-99 flex flex-col items-center justify-center select-none`}>
                <div className={`relative w-full h-3/5 flex flex-row items-end justify-center`}>
                    <div className={` relative h-full aspect-1-1 mr-10 flex flex-col items-stretch justify-center`} style={{ whiteSpace: 'nowrap' }}>
                        <p className={`text-8xl font-black self-center`} style={{fontFamily:'Crystal-Medium-2'}}>Kyushu<span style={{fontSize:'1.5rem'}}>&ensp;.Front-end</span> </p>
                        <p className={`text-1xl font-medium ml-80 self-end`}>^&ensp;前端技术</p>
                        <div className={`h-1/20 w-full text-1xl`} style={{fontFamily:'Crystal-Medium-2'}}><GetDate/></div>
                        <div className={`absolute w-1/4 self-end border-b-4 border-gary-500 bottom-45 border-double`}></div>
                        <div className={`absolute w-1/9 self-end border-b-4 border-gary-500 bottom-37 border-double mr-3`}></div>
                    </div>
                    <PointBalls/>
                </div>
                <div className={`relative w-full h-2/5  flex flex-row items-center justify-center`}>
                    <div className={`absolute w-1/2 h-1/2  flex flex-col items-center justify-end`}>
                        <p className={`mb-1 font-bold`}>{switchMS?.dataList ? switchMS.dataList[HomeListPage].title : HomeListPage}</p>
                        <div className={`w-1/3 h-full  border-t-4 border-double flex justify-center`}>
                            <p>∨</p>
                        </div>

                    </div>
                    <div className={`w-8/9 h-8/9`}>
                        <SwitchCards getPage={getHomeListPage}/>
                    </div>
                </div>
                <div className={`absolute bottom-0 text-gray-500 text-[0.7rem] pb-6`}>
                    <p className={`text-center`}>Copyright © 2025 G_Christine All rights reserved.</p>
                    <p className={`text-center`}><a href="https://beian.miit.gov.cn" target={'_blank'}>冀 ICP 备 2025115205号-1</a></p>
                </div>
            </div>

        </div>
    )
}
export default Home;