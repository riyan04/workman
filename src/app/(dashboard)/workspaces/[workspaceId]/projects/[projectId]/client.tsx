"use client"

import { PageError } from "@/components/PageError"
import { PageLoader } from "@/components/PageLoader"
import { Button } from "@/components/ui/button"
import { useGetProject } from "@/features/projects/api/useGetProject"
import ProjectAvatar from "@/features/projects/components/ProjectAvatar"
import { useProjectId } from "@/features/projects/hooks/useProjectId"
import TaskViewSwitcher from "@/features/tasks/components/TaskViewSwitcher"
import { PencilIcon } from "lucide-react"
import Link from "next/link"

export const ProjectIdClient = () => {
    const projectId = useProjectId()
    const {data, isLoading} = useGetProject({projectId})

    if(isLoading){
        return <PageLoader />
    }
    if(!data){
        return <PageError message="Project not found" />
    }
    return (
        <div className=" flex flex-col gap-y-4">
            <div className=" flex items-center justify-between">
                <div className=" flex items-center gap-x-2">
                    <ProjectAvatar image={data?.imageUrl} name={data?.name} className=" size-8" />
                    <p className=" text-lg font-semibold">
                        {data.name}
                    </p>
                </div>
                <div>
                    <Button variant={"secondary"} size={"sm"} asChild>
                        <Link href={`/workspaces/${data.workspaceId}/projects/${data.$id}/settings`}>
                            <PencilIcon />
                            Edit Project
                        </Link>
                    </Button>
                </div>
            </div>
            <TaskViewSwitcher hideProjectFilter />
        </div>
    )
}