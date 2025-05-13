import './index.css'
import {FC, useEffect, useState} from "react";
import { SidebarProvider, SidebarTrigger ,SidebarInset} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Outlet } from 'react-router-dom';

const Settings:FC = () => {
    // 从 sessionStorage 中获取初始值，如果没有则使用默认值 '账户信息'
    const initialDataFetching = sessionStorage.getItem('DataFetching') || '账户信息';
    const [DataFetching, setDataFetching] = useState<string>(initialDataFetching);

    // 当 DataFetching 状态发生变化时，将其保存到 sessionStorage 中
    useEffect(() => {
        sessionStorage.setItem('DataFetching', DataFetching);
    }, [DataFetching]);
    return (
        <SidebarProvider defaultOpen={true}>
            <AppSidebar setDataFetching={setDataFetching}/>
            <SidebarInset>
                <header className="z-49 fixed top-0 flex h-13 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12" style={{ backdropFilter: 'blur(4px)'}}>
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className={`w-9 h-9`}/>
                        <Separator orientation="vertical" className="mr-2 h-4" style={{borderLeft:'1px solid',height:'14px'}}/>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#/settings">
                                        设&ensp;置
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{DataFetching}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="p-4 pt-0">
                    <div className="h-13 shrink-0" />
                    <div className="h-auto flex-1 rounded-xl  md:min-h-min">
                        <Outlet />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
export default Settings;