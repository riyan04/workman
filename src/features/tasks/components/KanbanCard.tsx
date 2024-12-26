import { MoreHorizontalIcon } from "lucide-react"
import { TaskType } from "../types"
import { TaskActions } from "./TaskActions"
import { Separator } from "@/components/ui/separator"
import MemberAvatar from "@/features/members/components/MemberAvatar"
import { TaskDate } from "./TaskDate"
import ProjectAvatar from "@/features/projects/components/ProjectAvatar"

interface KanbanCardProps{
    task: TaskType
}

export const KanbanCard = ({task}: KanbanCardProps) => {
  return (
    <div className=" bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3">
        <div className=" flex items-center justify-between gap-x-2">
            <p className=" text-sm line-clamp-2">{task.name}</p>
            <TaskActions id={task.$id} projectId={task.projectId} >
                <MoreHorizontalIcon className="size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition" />
            </TaskActions>
        </div>
        <Separator />
        <div className=" flex items-center gap-x-1.5">
            <MemberAvatar className=" size-5" name={task.assignee.name} fallbackClassname=" text-[10px]" />
            <div className=" size-1 rounded-full bg-neutral-300" />
            <TaskDate value={task.dueDate} className=" text-xs" />
        </div>
        <div className=" flex items-center gap-x-1.5">
            <ProjectAvatar name={task.project.name} image={task.project.imageUrl} fallbackClassname="text-[10px]" />
            <span className=" text-xs font-medium">{task.project.name}</span>
        </div>
    </div>
  )
}

