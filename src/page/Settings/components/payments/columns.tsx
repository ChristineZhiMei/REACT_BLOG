"use client"

import {Button} from "@/components/ui/button";
import {ColumnDef} from "@tanstack/react-table"
import {ArrowUpDown} from "lucide-react"
import EditList from "./tempCard.tsx";
export type Payment = {
    title: string;
    url: string;
    classification: string;
    describe: string;
    id?: string;
    favicon?: string;
}

import {Checkbox} from "@/components/ui/checkbox"





export const columns: ColumnDef<Payment>[] = [
    {
        id: "select",
        header: ({table}) => (
            <div className="flex items-center justify-start space-x-2">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className={`cursor-pointer`}
                />
            </div>
        ),
        cell: ({row}) => (
            <div className="flex items-center justify-start space-x-2">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className={`cursor-pointer`}
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 30,
    },
    {
        accessorKey: "title",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className={`cursor-pointer text-1xl text-[var(--dark-mode-rearview,#fff)] font-semibold select-none`}
                >
                    名称
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
        size: 60,
    },
    {
        accessorKey: "url",
        header: "网址",
        size: 100,

    },
    {
        accessorKey: "classification",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className={`cursor-pointer text-1xl text-[var(--dark-mode-rearview,#fff)] font-semibold select-none`}
                >
                    分类
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
        size: 40,

    },
    {
        accessorKey: "describe",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className={`cursor-pointer text-1xl text-[var(--dark-mode-rearview,#fff)] font-semibold select-none`}
                >
                    描述
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
        size: 130
    },
    {
        id: "actions",
        size: 40,
        cell: ({row}) => ( // 接收 row 参数
            <EditList rows={row}/>
        )
    }
]
