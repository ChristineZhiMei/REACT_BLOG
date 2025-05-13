import {UserRound, HomeIcon,Bookmark,SendHorizontal} from "lucide-react"
import { NavUser } from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
    SidebarRail,
    SidebarSeparator
} from "@/components/ui/sidebar"
import { useNavigate} from "react-router-dom";
import SwitchTheme from "@/components/SwitchTheme/SwitchTheme.tsx";
import reactAvatar from '../assets/account.jpg';
import * as React from "react";
type itemType={
    title: string,
    url: string,
    icon: React.ComponentType<any>,
    isActive: boolean,
}
// Menu items.
const items:itemType[] = [
    {
        title: "账号信息",
        url: "#/settings/account",
        icon: UserRound,
        isActive: true,
    },
    {
        title: "快捷访问",
        url: "#/settings/quickAccess",
        icon: Bookmark,
        isActive: false,
    },
    {
        title: "反馈",
        url: "#/settings/feedback",
        icon: SendHorizontal,
        isActive: false,
    },
]
type AppSidebarProps = {
    setDataFetching: (title: string) => void;
};
export function AppSidebar({ setDataFetching } :AppSidebarProps) {
    const navigate = useNavigate();

    return (
        <Sidebar collapsible='icon' style={{borderColor: "var(--dark-mode-rearview-3,#353535)"}} className={`whitespace-nowrap`}>
            <SidebarHeader>
                <SidebarMenuButton onClick={()=>{navigate("/home")}} className={`cursor-pointer`} >
                    <HomeIcon/>
                    主页
                </SidebarMenuButton>
            </SidebarHeader>
            <SidebarSeparator className={`m-0 self-center`} style={{width:'90%'}}/>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>设置<div className={`relative w-5 ml-auto aspect-square`}><SwitchTheme/></div></SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton className={`cursor-pointer`} asChild>
                                        <a href={item.url} onClick={()=>{
                                            setDataFetching(item.title)
                                        }}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarSeparator className={`m-0 self-center`} style={{width:'90%'}}/>
            <SidebarFooter>
                <NavUser user={
                    {
                        name: 'Christine',
                        email: '2977797064@qq.com',
                        avatar: reactAvatar
                    }
                } />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
