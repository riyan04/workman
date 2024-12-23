import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ExternalLinkIcon, PencilIcon, Trash2Icon } from "lucide-react";

interface TaskActionsProps{
    id: string;
    projectId: string;
    children: React.ReactNode
}

export const TaskActions = ({id, projectId, children}:TaskActionsProps) => {
  return (
    <div className=" flex justify-end">
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className=" w-48">
                <DropdownMenuItem onClick={()=>{}} disabled={false} className=" font-medium p-[10px]">
                    <ExternalLinkIcon className=" size-4 mr-2 stroke-2" />
                    Task Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=>{}} disabled={false} className=" font-medium p-[10px]">
                    <ExternalLinkIcon className=" size-4 mr-2 stroke-2" />
                    Open Project
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=>{}} disabled={false} className=" font-medium p-[10px]">
                    <PencilIcon className=" size-4 mr-2 stroke-2" />
                    Edit Task
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=>{}} disabled={false} className=" text-amber-700 focus:text-amber-800 font-medium p-[10px]">
                    <Trash2Icon className=" size-4 mr-2 stroke-2" />
                    Delete Task
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
  )
}

