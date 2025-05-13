import {useContext } from "react";
import { columns, Payment } from "./columns"
import { DataTable } from "./data-table"
import { Toaster } from "@/components/ui/sonner"
import {themeSwitch} from "@/App.tsx";
import * as React from "react";
const QuickAccess = () => {
    const switchMS = useContext(themeSwitch)
    // useEffect(() => {
    //     console.log(switchMS?.dataList)
    // },[switchMS?.dataList])
    const safeSetDataList: React.Dispatch<React.SetStateAction<Payment[]>> = (newData) => {
        if (switchMS?.setDataList) {
            switchMS.setDataList(newData as Payment[]);
        }
    };
    return (
        <div className="container mx-auto">
            <DataTable columns={columns} data={switchMS?.dataList ?? []} userID={switchMS?.userList.id ?? -1}  setDataList={safeSetDataList} />
            <Toaster />
        </div>
    )
}
export default QuickAccess;