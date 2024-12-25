import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/useConfirm";
import { ExternalLinkIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useDeleteTask } from "../api/useDeleteTask";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";
import { useEditTaskModal } from "../hooks/useEditTaskModal";

interface TaskActionsProps {
    id: string;
    projectId: string;
    children: React.ReactNode
}

export const TaskActions = ({ id, projectId, children }: TaskActionsProps) => {
    const router = useRouter()
    const workspaceId = useWorkspaceId()

    const {open} = useEditTaskModal()
    const [DeleteDialog, confirmDelete] = useConfirm(
        "Delete Task",
        "This action cannot be undone",
        "destructive"
    )
    const {mutate, isPending} = useDeleteTask()

    const onDelete = async() => {
        const ok = await confirmDelete()
        if(!ok) return

        mutate({taskId: id})
    }

    const onOpenTask = () => {
        router.push(`/workspaces/${workspaceId}/tasks/${id}`)
    }
    const onOpenProject = () => {
        router.push(`/workspaces/${workspaceId}/projects/${projectId}`)
    }

    return (
        <div className=" flex justify-end">
            <DeleteDialog />
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    {children}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className=" w-48">
                    <DropdownMenuItem onClick={onOpenTask} className=" font-medium p-[10px]">
                        <ExternalLinkIcon className=" size-4 mr-2 stroke-2" />
                        Task Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onOpenProject} className=" font-medium p-[10px]">
                        <ExternalLinkIcon className=" size-4 mr-2 stroke-2" />
                        Open Project
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => open(id)} className=" font-medium p-[10px]">
                        <PencilIcon className=" size-4 mr-2 stroke-2" />
                        Edit Task
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onDelete} disabled={isPending} className=" text-amber-700 focus:text-amber-800 font-medium p-[10px]">
                        <Trash2Icon className=" size-4 mr-2 stroke-2" />
                        Delete Task
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

