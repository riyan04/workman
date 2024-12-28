"use client"

import { Analytics } from "@/components/Analytics"
import { PageError } from "@/components/PageError"
import { PageLoader } from "@/components/PageLoader"
import { Button } from "@/components/ui/button"
import { useGetProject } from "@/features/projects/api/useGetProject"
import { useGetProjectAnalytics } from "@/features/projects/api/useGetProjectAnalytics"
import ProjectAvatar from "@/features/projects/components/ProjectAvatar"
import { useProjectId } from "@/features/projects/hooks/useProjectId"
import TaskViewSwitcher from "@/features/tasks/components/TaskViewSwitcher"
import { PencilIcon } from "lucide-react"
import Link from "next/link"

export const ProjectIdClient = () => {
    const projectId = useProjectId()
    const {data: project, isLoading: isLoadingProject} = useGetProject({projectId})
    const {data: analytics, isLoading: isLoadingAnalytics} = useGetProjectAnalytics({projectId})

    const isLoading = isLoadingProject || isLoadingAnalytics

    if(isLoading){
        return <PageLoader />
    }
    if(!project){
        return <PageError message="Project not found" />
    }
    return (
        <div className=" flex flex-col gap-y-4">
            <div className=" flex items-center justify-between">
                <div className=" flex items-center gap-x-2">
                    <ProjectAvatar image={project.imageUrl} name={project.name} className=" size-8" />
                    <p className=" text-lg font-semibold">
                        {project.name}
                    </p>
                </div>
                <div>
                    <Button variant={"secondary"} size={"sm"} asChild>
                        <Link href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}>
                            <PencilIcon />
                            Edit Project
                        </Link>
                    </Button>
                </div>
            </div>
            {analytics ? (

                <Analytics data={analytics} />
            ): null}
            <TaskViewSwitcher hideProjectFilter />
        </div>
    )
}