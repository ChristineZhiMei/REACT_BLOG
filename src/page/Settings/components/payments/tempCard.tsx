import {FC, useContext, useState} from "react";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Payment} from "@/page/Settings/components/payments/columns.tsx";
import {Row} from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Pencil, TableOfContents, Trash} from "lucide-react";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {themeSwitch} from "@/App.tsx";
import {toast as sonnerToast} from "sonner";
import {API_URL} from "@/utils/apis.ts";
const defaultListItem  :string[][] = [
    ["title","名称","BiliBili"],
    ["url","网址","https://www.bilibili.com/"],
    ["classification","类别","视频"],
    ["describe",'描述',"B站大学"]
]
interface EditListProps {
    rows?: Row<Payment>
}

const EditList: FC<EditListProps> = ({ rows }) => {
    const switchMS = useContext(themeSwitch)
    const [tempList, setTempList] = useState<Payment>({
        title: rows?.original["title"] ?? '',
        url: rows?.original["url"] ?? '',
        classification: rows?.original["classification"] ?? '',
        describe: rows?.original["describe"] ?? ''
    });

    const dataList = switchMS?.dataList?? [];
    const setDataList = switchMS?.setDataList as React.Dispatch<React.SetStateAction<Payment[]>> | undefined;
    const submit = async (row_id:string,id:number) => {
        if (rows) {
            const idToUpdate = row_id;
            // 使用 map 方法更新对应 id 的项
            const updatedDataList = dataList.map((item,index) => {
                if (index.toString() === idToUpdate) {
                    return { ...item, ...tempList };
                }
                return item;
            });
            const tempDict = {
                user_info_id: switchMS?.userList.id ?? -1,
                id: id,
                title: tempList.title,
                url: tempList.url,
                classification: tempList.classification,
                describe: tempList.describe
            }
            if(setDataList){
                setDataList(updatedDataList);
            }
            const url = API_URL+'/update/change/list'
            await fetch(url,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(tempDict)
            }).then(()=>switchMS?.refreshUser());
        }
    }

    const deleteSubmit = async (row_id:string,id:number) => {
        if (setDataList) {
            setDataList((prevData) =>
                prevData.filter((_item,index) => index.toString() !== row_id)
            );
        }
        const url = API_URL+'/delete'
        await fetch(url,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                user_info_id: switchMS?.userList.id ?? -1,
                access_list_id:[id,]
            })
        }).then((res)=>console.log(res));
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`cursor-pointer mr-3 `}>
                    <TableOfContents size={20}/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                style={{borderColor: "var(--dark-mode-rearview-3,#353535)", transition: "borderColor 0.5s"}}>
                <DropdownMenuItem asChild
                                  className={`flex flex-row justify-center items-center cursor-pointer`}>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant={"ghost"} className={`w-full cursor-pointer select-none`}><Pencil/>编辑</Button>
                        </DialogTrigger>
                        <DialogContent style={{
                            borderColor: "var(--dark-mode-rearview-3,#353535)",
                            transition: "borderColor 0.5s"
                        }}>
                            <DialogHeader>
                                <DialogTitle>编辑</DialogTitle>
                                <DialogDescription>
                                    修改此条目
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                {defaultListItem.map((item, index) => {
                                    const field = item[0] as keyof Payment;

                                    return (
                                        <div className="grid grid-cols-6 items-center gap-4" key={index}>
                                            <Label htmlFor={item[0]} className={`font-bold flex flex-row justify-end items-start`}>
                                                {item[1]}
                                            </Label>
                                            {item[0] !== 'describe' ? (
                                                <Input
                                                    id={field}
                                                    defaultValue={tempList[field]}
                                                    className="col-span-5"
                                                    onChange={(e)=>{
                                                        setTempList({
                                                            ...tempList,
                                                            [field]:e.target.value
                                                        })
                                                    }}

                                                />
                                            ) : (
                                                <Textarea
                                                    id={field}
                                                    defaultValue={tempList[field]}
                                                    className="col-span-5"
                                                    onChange={(e)=>{
                                                        setTempList({
                                                            ...tempList,
                                                            [field]:e.target.value
                                                        })
                                                    }}
                                                />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="destructive" className={`cursor-pointer`}>取消</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button type="submit"
                                            className={`cursor-pointer`}
                                            onClick={() => {
                                        if (rows) {
                                            // 确保 Payment 接口或者 Row 类型包含 id 属性
                                            if ('id' in rows) {
                                                const rowId = Number(rows.original.id);
                                                submit(rows.id,rowId);
                                                sonnerToast.success(
                                                    <div>修改成功</div>
                                                )
                                            } else {
                                                console.error('rows 对象不存在 id 属性');
                                            }
                                        } else {
                                            console.error('rows 为 undefined');
                                            sonnerToast.error(
                                                <div>修改失败</div>
                                            )
                                        }
                                    }}>确认</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Button variant={'ghost'}
                            className={`w-full flex flex-row justify-center items-center cursor-pointer`}
                            onClick={()=>{
                                if(rows) {
                                    const rowId = Number(rows.original.id);
                                    console.log(typeof rows.original.id)
                                    deleteSubmit(rows.id,rowId)
                                }
                            }}
                    >
                        <Trash/>删除
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}
export default EditList;