import {FC, useState, useEffect, useContext} from "react";
import { type CarouselApi } from "@/components/ui/carousel"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import {themeSwitch} from "@/App.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
// import react Logo from '@/assets/react.svg';
type SetHomeListPageType = (value: number | ((prevState: number) => number)) => void;
interface SwitchCardsProps {
    getPage: SetHomeListPageType;
}
const SwitchCards:FC<SwitchCardsProps> = (props) => {
    const [api, setApi] = useState<CarouselApi>()
    useEffect(() => {
        if (!api) {
            return
        }
        props.getPage((api.selectedScrollSnap() + 7) % api.scrollSnapList().length)
        api.on("select", () => {
            props.getPage((api.selectedScrollSnap() + 7) % api.scrollSnapList().length)
        })
    }, [api, props])

    const switchMS = useContext(themeSwitch)
    const dataList = switchMS?.dataList

    return (
        <div className={`w-full h-full flex flex-row items-center justify-center`}>
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-8/9"
                setApi={setApi}
            >
                <CarouselContent>
                    {
                        dataList ? dataList.map((_item, index) => (
                            <CarouselItem key={index} className="basis-1/15 ">
                                <div
                                    className=" flex flex-row justify-center items-center cursor-pointer"
                                    onClick={() => {
                                        api?.scrollTo((index - 7) % dataList.length)
                                        window.open(
                                            _item.url,
                                            "_blank"
                                        )
                                    }}
                                >
                                    <HoverCard openDelay={200} closeDelay={100}>
                                        <HoverCardTrigger>
                                            <Avatar
                                                className={`${(((api?.selectedScrollSnap() ?? 0) + 7) % dataList.length) === index ? 'h-15 w-15' :'h-16 w-16'} rounded-lg hover:h-14 hover:w-14 transition-all duration-400 `}>
                                                <AvatarImage src={_item.favicon} alt="@shadcn" />
                                                <AvatarFallback>{_item.title.substring(0,2) ?? 'CN'}</AvatarFallback>
                                            </Avatar>
                                        </HoverCardTrigger>
                                        <HoverCardContent className={`borderColorDiv bg-[var(--dark-mode-foreground,#000)] z-99`} sideOffset={15}>
                                            <p className={`font-bold text-center`}>{_item.title}</p>
                                            <p className={`text-sm text-center`}>{_item.describe}</p>
                                        </HoverCardContent>
                                    </HoverCard>
                                </div>
                            </CarouselItem>
                        )): Array.from({ length: 50 }).map((_, index) => (
                                    <CarouselItem key={index} className="basis-1/15">
                                        <div className=" flex flex-row justify-center items-center">
                                            {index}
                                        </div>
                                    </CarouselItem>))
                    }
                </CarouselContent>
                <CarouselPrevious className={`cursor-pointer`}/>
                <CarouselNext className={`cursor-pointer`}/>
            </Carousel>
        </div>
    )
}
export default SwitchCards;