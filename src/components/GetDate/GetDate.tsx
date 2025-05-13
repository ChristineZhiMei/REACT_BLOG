import { useState,useEffect } from "react";
type DateType = {
    year: string,
    month: string,
    day: string,
    hour: string,
    minutes: string,
    seconds: string
}
function GetDate() {
    const [date, setDate] = useState<DateType>();

    const getNewDate = () => {
        const time = new Date();
        const year = time.getFullYear().toString(); //年
        const month = (time.getMonth() + 1 ).toString(); //月
        const day = time.getDate().toString(); //日
        const hour = time.getHours().toString(); //时
        const minutes = time.getMinutes().toString();//分
        const s = time.getSeconds(); //秒
        const seconds = s <= 9 ? "0" + s : s.toString();
        const t:DateType = {
            year,
            month,
            day,
            hour,
            minutes,
            seconds,
        }
        setDate(t);
    }
    useEffect(() => {
        const intervalId = setInterval(getNewDate, 1000);

        // 组件卸载时清除定时器
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <div className={`h-full flex flex-row items-center`}>
            &gt;&ensp;
            <div className={`h-full border-1 border-gray-500 rounded-[5px] flex flex-row`}>
                <div className={'h-full aspect-12-5 flex flex-row items-center justify-center'}>
                    {date?.year ? date.year : '----'}
                </div>
            </div>
            &thinsp;
            <span style={{fontFamily:'Microsoft YaHei'}}>-</span>
            &thinsp;
            <div className={`h-full border-1 border-gray-500 rounded-[5px] flex flex-row`}>
                <div className={'h-full aspect-6-5 flex flex-row items-center justify-center border-r-1 border-gray-500'}>
                    {date?.month ? date.month : '--'}
                </div>
                <div className={'h-full aspect-6-5 flex flex-row items-center justify-center'}>
                    {date?.day ? date.day : '--'}
                </div>
            </div>
            &thinsp;
            <span style={{fontFamily:'Microsoft YaHei'}}>-</span>
            &thinsp;
            <div className={`h-full border-1 border-gray-500 rounded-[5px] flex flex-row`}>
                <div className={'h-full aspect-6-5 flex flex-row items-center justify-center border-r-1 border-gray-500'}>
                    {date?.hour ? date?.hour : '--'}
                </div>
                <div className={'h-full aspect-6-5 flex flex-row items-center justify-center border-r-1 border-gray-500'}>
                    {date?.minutes ? date.minutes : '--'}
                </div>
                <div className={'h-full aspect-6-5 flex flex-row items-center justify-center '}>
                    {date?.seconds ? date?.seconds : '--'}
                </div>
            </div>
        </div>
    )

}
export default GetDate;