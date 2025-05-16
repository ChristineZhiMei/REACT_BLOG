import { FC } from "react";
import blogLogo from '../../assets/blog_logo.svg';
import reactAvatar from '@/assets/account.jpg';
import './index.css'
import {
    NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList,navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import SwitchTheme from "@/components/SwitchTheme/SwitchTheme.tsx";
import {useNavigate} from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuGroup,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Bolt,LogOut} from "lucide-react"

const Navigation:FC = () => {
    const navigate = useNavigate();
    return (
        <div className={`w-full h-[55px] top-0 fixed z-888 flex flex-row justify-center border-gray-400 border-dashed overflow-hidden border-b-1 select-none`} style={{ backdropFilter: 'blur(4px)'}}>
            <div className={`w-9/10 h-full flex flex-row justify-items-stretch items-center flex-nowrap`}>
                <img src={blogLogo} alt="" className={`loginHomeSVG h-2/3 justify-self-start`}/>
                <p className={`justify-self-start font-black ml-2 pr-4 border-r-gray-400 border-r-1 border-dashed`} style={{color: 'var(--dark-mode-rearview,#fff)', transition: 'color 0.5s'}}>KYUSHU</p>
                <NavigationMenu  style={{ whiteSpace: 'nowrap' }}>
                    <NavigationMenuList>
                        <NavigationMenuItem className={`mx-1`}>
                            <NavigationMenuLink className={`${navigationMenuTriggerStyle()} cursor-pointer`}>
                                <span className={`font-semibold`}>HOME</span>
                            </NavigationMenuLink>
                            <NavigationMenuLink className={`${navigationMenuTriggerStyle()} cursor-pointer`}>
                                <span className={`font-semibold`}>PHOTOS</span>
                            </NavigationMenuLink>
                            <NavigationMenuLink className={`${navigationMenuTriggerStyle()} cursor-pointer`}>
                                <span className={`font-semibold`}>BIOGRAPHY</span>
                            </NavigationMenuLink>
                            <NavigationMenuLink target={`_blank`} href={'https://github.com/ChristineZhiMei'} className={`${navigationMenuTriggerStyle()} cursor-pointer`}>
                                <span className={`font-semibold`}>GITHUB</span>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
                <div className={`relative ml-auto mr-3 h-2/5 aspect-1-1`}>
                    <SwitchTheme/>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className={`size-10 cursor-pointer`}>
                            <AvatarImage src={reactAvatar} alt="@shadcn" />
                            <AvatarFallback>KY</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className={`w-15 z-900`}
                        style={{borderColor: "var(--dark-mode-rearview-3,#353535)"}}>
                        <DropdownMenuGroup>
                            <DropdownMenuItem className={`flex flex-row justify-center items-center cursor-pointer`} onClick={()=>{navigate('/settings')}}>
                                <Bolt/>
                                设&ensp;置
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className={`flex flex-row justify-center items-center cursor-pointer`}
                                              onClick={()=>{
                                                  navigate('/login')
                                                  localStorage.setItem('token', '')}
                            }>
                                <LogOut/>
                                注&ensp;销
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
export default Navigation;