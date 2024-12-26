import { ProjectType } from "@/features/projects/types";

import { TaskStatus } from "../types";
import { cn } from "@/lib/utils";
import MemberAvatar from "@/features/members/components/MemberAvatar";
import ProjectAvatar from "@/features/projects/components/ProjectAvatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";
import { useRouter } from "next/navigation";

interface EventCardProps{
    title: string;
    assignee: {
        name: string;
        email: string;
        $id: string;
        $collectionId: string;
        $databaseId: string;
        $createdAt: string;
        $updatedAt: string;
        $permissions: string[];
    };
    project: ProjectType;
    status: TaskStatus;
    id: string
}


const statusColorMap: Record<TaskStatus, string> = {
    [TaskStatus.BACKLOG]: "border-l-grey-500",
    [TaskStatus.TODO]: "border-l-red-500",
    [TaskStatus.IN_PROGRESS]: "border-l-yellow-500",
    [TaskStatus.IN_REVIEW]: "border-l-blue-500",
    [TaskStatus.DONE]: "border-l-emerald-500",
}

export const EventCard = ({title, assignee, project, status, id}: EventCardProps) => {
    const workspaceId = useWorkspaceId()
    const router = useRouter()


    const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        router.push(`/workspaces/${workspaceId}/tasks/${id}`)
    }
  return (
    <div className=" px-2">
        <div onClick={onClick} className={cn(
            "p-1.5 text-xs bg-white text-primary border rounded-md border-l-4 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition",
            statusColorMap[status]
        )}>
            <p>{title}</p>
            <div className=" flex items-center gap-x-1">
                <MemberAvatar className=" size-5" name={assignee.name} fallbackClassname=" text-[10px]" />
                <div className=" size-1 rounded-full bg-neutral-300" />
                <ProjectAvatar name={project.name} image={project.imageUrl} />
            </div>
        </div>
    </div>
  )
}
