import { snakeCaseToTitleCase } from "@/lib/utils";
import { TaskStatus } from "../types"
import { CircleCheckBigIcon, CircleDashedIcon, Layers3Icon, LayoutListIcon, ScanEyeIcon } from "lucide-react"
// import { Button } from "@/components/ui/button";
// import { useCreateTaskModal } from "../hooks/useCreateTaskModal";

interface KanbanColumnHeaderProps{
    board: TaskStatus;
    taskCount: number
}

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
    [TaskStatus.BACKLOG]: (
        <Layers3Icon className=" size-[18px] text-gray-400" />
    ),
    [TaskStatus.TODO]: (
        <LayoutListIcon className=" size-[18px] text-red-400" />
    ),
    [TaskStatus.IN_PROGRESS]: (
        <CircleDashedIcon className=" size-[18px] text-yellow-400" />
    ),
    [TaskStatus.IN_REVIEW]: (
        <ScanEyeIcon className=" size-[18px] text-blue-400" />
    ),
    [TaskStatus.DONE]: (
        <CircleCheckBigIcon className=" size-[18px] text-emerald-400" />
    ),
}

export const KanbanColumnHeader = ({board, taskCount}: KanbanColumnHeaderProps) => {
    // const {open} = useCreateTaskModal()
    const icon = statusIconMap[board]
  return (
    <div className=" px-2 py-1.5 flex items-center justify-between">
        <div className=" flex items-center gap-x-2">
            {icon}
            <h2 className=" text-sm font-medium">
                {snakeCaseToTitleCase(board)}
            </h2>
            <div className=" size-5 flex items-center justify-center rounded-md bg-neutral-200 text-xs text-neutral-700 font-medium">
                {taskCount}
            </div>
        </div>
        {/* <Button onClick={open} variant={"ghost"} size={"icon"} className=" size-5">
            <PlusIcon className=" size-4 text-neutral-500" />
        </Button> */}
    </div>
  )
}
