"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast as sonnerToast } from "sonner";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
    SortingState,
    ColumnFiltersState,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState} from "react"
import { Payment } from './columns.tsx'
import * as React from "react";
import {API_URL} from "@/utils/apis.ts";

interface DataTableProps {
    columns: ColumnDef<Payment>[]
    data: Payment[],
    userID:number,
    setDataList: React.Dispatch<React.SetStateAction<Payment[]>>;
}
// 移除不必要的泛型参数
export function DataTable({
    columns,
    data,
    userID,
    setDataList,
}: DataTableProps) {
    const [internalData, setInternalData] = useState<Payment[]>(data)
    // 添加缺失的状态声明
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = useState({});
    // 修改表格实例化
    const table = useReactTable({
        data: internalData,
        columns,
        enableColumnResizing: false,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            rowSelection
        },
    })
    const classificationSet = (dataList: Payment[]): Set<string> =>{
        const temp:Set<string> = new Set();
        dataList.forEach((item) => {
            const typedItem = item as { classification: string };
            temp.add(typedItem.classification);
        })
        return temp;
    }

    const [listPage, setListPage] = useState<number>(1);
    const [addListItem, setAddListItem] = useState<Payment>({
        title:"",
        url:"",
        classification:"",
        describe:""
    });
    const defaultListItem  :string[][] = [
        ["title","名称","BiliBili"],
        ["url","网址","https://www.bilibili.com/"],
        ["classification","类别","视频"],
        ["describe",'描述',"B站大学"]
    ]
    const someFunction = async () => {
        // 显示成功提示
        if(addListItem.title === '' || addListItem.url === '' || addListItem.classification === '' || addListItem.describe === ''){
            sonnerToast.error(
                <div className={`select-none`}>
                    <p>添加失败！</p>
                    <p>请检查输入内容是否完整！</p>
                </div>
            );
            return;
        }
        // 直接计算新的数组
        const newData: Payment[] = [...internalData, addListItem];
        // 更新 internalData 状态
        setInternalData(newData);
        // 直接传递新的数组给 setDataList
        setDataList(newData);

        sonnerToast.success(
            <div className={`select-none`}>
                <p className={`text-[15px]`}>添加成功！</p>
                <p>名称：{addListItem.title}</p>
                <p>网址：{addListItem.url}</p>
                <p>类别：{addListItem.classification}</p>
                <p>描述：{addListItem.describe}</p>
            </div>
        );
        await fetch(API_URL+"/update/add/list",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                user_info_id: userID ?? -1,
                title: addListItem.title,
                url: addListItem.url,
                classification: addListItem.classification,
                describe: addListItem.describe
            })
        });

        return;
    };

    useEffect(() => {
        setInternalData(data);
    }, [data]);

    const deleteSubmit = async (rows_id:string[],id:number[]) => {
        if (setDataList) {
            setDataList((prevData :Payment[]) =>
                prevData.filter((_item:Payment,index:number) => !rows_id.includes(index.toString()))
            );
            table.resetRowSelection();
            const url = API_URL+'/delete'
            await fetch(url,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    user_info_id: userID ?? -1,
                    access_list_id:id
                })
            })
            sonnerToast.success(
                <div className={`select-none`}>
                    <p>成功删除{rows_id.length}个条目</p>
                </div>
            )
        }
        else{
            sonnerToast.error(
                <div className={`select-none`}>
                    <p>删除失败！</p>
                </div>
            )
        }
    }
    return (
        <div>
            <div className="flex items-center py-4">
                <Input
                    placeholder="搜索名称..."
                    value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("title")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm mr-3"
                />
                <Select defaultValue={'all'} onValueChange={(e) =>{
                    table.getColumn("classification")?.setFilterValue(e === 'all' ? '' : e)
                }}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="选择分类..." />
                    </SelectTrigger>
                    <SelectContent style={{borderColor: "var(--dark-mode-rearview-3,#353535)",transition:"borderColor 0.5s"}}>
                        <SelectGroup>
                            <SelectItem value="all">所有类别...</SelectItem>
                            {Array.from(classificationSet(internalData)).map((item,index) => <SelectItem key={index} value={item}>{item}</SelectItem>)}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Dialog>
                    <DialogTrigger asChild className={`ml-3`}>
                        <Button onClick={()=>{
                            setAddListItem({
                                title: "",
                                url: "",
                                classification: "",
                                describe: ""
                            })
                        }} className={`font-bold cursor-pointer select-none`}>添加</Button>
                    </DialogTrigger>
                    <DialogContent style={{borderColor: "var(--dark-mode-rearview-3,#353535)",transition:"borderColor 0.5s"}}>
                        <DialogHeader>
                            <DialogTitle>添加快捷访问</DialogTitle>
                            <DialogDescription>
                                将此链接添加到快捷访问中，以便下次访问时更快地访问。
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            {defaultListItem.map((item,index) => (
                                <div className="grid grid-cols-6 items-center gap-4" key={index}>
                                    <Label htmlFor={item[0]} className={`font-bold flex flex-row justify-end items-start`}>
                                        {item[1]}
                                    </Label>
                                    {item[0] !== 'describe' ?
                                        <Input
                                            id={item[0]}
                                            placeholder={item[2]}
                                            className="col-span-5"
                                            onChange={(e) => {
                                                setAddListItem({
                                                    ...addListItem,
                                                    [item[0]]:e.target.value
                                                })
                                            }}
                                        /> : <Textarea
                                            id={item[0]}
                                            placeholder={item[2]}
                                            className="col-span-5"
                                            onChange={(e) => {
                                                setAddListItem({
                                                    ...addListItem,
                                                    [item[0]]:e.target.value
                                                })
                                            }}
                                        />}
                                </div>
                            ))}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="destructive" className={`cursor-pointer`}>取消</Button>
                            </DialogClose>
                            <Button type="submit" onClick={()=>{
                                someFunction();
                                // console.log(addListItem)
                            }}>确认</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog>
                    <DialogTrigger asChild className={`ml-3`}>
                        <Button className={`font-bold cursor-pointer select-none`} disabled={table.getFilteredSelectedRowModel().rows.length === 0}>删除</Button>
                    </DialogTrigger>
                    <DialogContent style={{borderColor: "var(--dark-mode-rearview-3,#353535)",transition:"borderColor 0.5s"}}>
                        <DialogHeader>
                            <DialogTitle>即将删除</DialogTitle>
                            <DialogDescription>
                                是否删除选中的{table.getFilteredSelectedRowModel().rows.length}个项目？
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="destructive" className={`cursor-pointer`}>取消</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button
                                    type="submit"
                                    className={`cursor-pointer`}
                                    onClick={()=>{
                                        const temp: [Array<string>,Array<number>]= [[],[]]
                                        table.getFilteredSelectedRowModel().rows.forEach((item) => {
                                            const rowId = Number(item.original.id)
                                            temp[0].push(item.id)
                                            temp[1].push(rowId)
                                        })
                                        deleteSubmit(temp[0],temp[1])
                                    }}
                                >
                                    确认
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <div className="flex items-center justify-end space-x-2 ml-auto ">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            table.previousPage()
                            setListPage((prev) => prev - 1);
                        }}
                        disabled={!table.getCanPreviousPage()}
                        className={`cursor-pointer select-none`}

                    >
                        前一页
                    </Button>
                    <div className="flex-1 text-sm text-muted-foreground">
                        {listPage}/
                        {table.getPageCount()}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            table.nextPage()
                            setListPage((prev) => prev + 1);
                        }}
                        disabled={!table.getCanNextPage()}
                        className={`cursor-pointer select-none`}
                    >
                        后一页
                    </Button>
                </div>


            </div>
            <div className="rounded-md border overflow-hidden"  style={{borderColor: "var(--dark-mode-rearview-3,#353535)",transition:"borderColor 0.5s"}}>
                <Table className="table-fixed">
                    <TableHeader className="bg-[var(--dark-mode-rearview-3,#353535)] transition-background duration-500">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                                className="border-[var(--dark-mode-rearview-3,#353535)] transition-border duration-500"
                            >
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="text-[15px] text-[var(--dark-mode-rearview,#fff)] font-semibold select-none"
                                        style={{
                                            width: `${header.column.getSize()}px`, // 从列定义获取宽度
                                            minWidth: `${header.column.getSize()}px` // 防止内容挤压
                                        }}
                                    >
                                        {!header.isPlaceholder && flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody >
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    style={{borderColor: "var(--dark-mode-rearview-3,#353535)"}}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className={`overflow-hidden text-ellipsis whitespace-nowrap`}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow  style={{borderColor: "var(--dark-mode-rearview-3,#353535)"}}>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>

    )
}
