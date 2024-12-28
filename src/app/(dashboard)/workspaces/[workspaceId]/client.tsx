"use client"

import { Analytics } from "@/components/Analytics"
import { PageError } from "@/components/PageError"
import { PageLoader } from "@/components/PageLoader"
import { useGetMembers } from "@/features/members/api/useGetMembers"
import { useGetProjects } from "@/features/projects/api/useGetProjects"
import { useCreateProjectModal } from "@/features/projects/hooks/useCreateProjectModal"
import { useGetTasks } from "@/features/tasks/api/useGetTasks"
import { useCreateTaskModal } from "@/features/tasks/hooks/useCreateTaskModal"

import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/useGetWorkspaceAnalytics"
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId"

export const WorkspaceIdClient = () => {
    const workspaceId = useWorkspaceId()

    const { data: analytics, isLoading: isLoadingAnalytics } = useGetWorkspaceAnalytics({ workspaceId })
    const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId })
    const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId })
    const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({ workspaceId })





    const isLoading = isLoadingAnalytics ||
        isLoadingProjects ||
        isLoadingMembers ||
        isLoadingTasks


    if (isLoading) {
        return <PageLoader />
    }

    if (!analytics || !projects || !members || !tasks) {
        return <PageError message="Failed to load workspace data" />
    }

    return (
        <div className=" h-full flex flex-col space-y-4">
            <Analytics data={analytics} />
            <div className=" grid grid-cols-1 xl:grid-cols-2 gap-4">
                <TaskList data={tasks.documents} total={tasks.total} />
                <ProjectList data={projects.documents} total={projects.total} />
                <MemberList data={members.documents} total={members.total} />
            </div>
        </div>
    )
}


// TASK LIST COMPONENT
import { TaskType } from "@/features/tasks/types"
import { Button } from "@/components/ui/button"
import { CalendarIcon, PlusIcon, SettingsIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"


interface TaskListProps {
    data: TaskType[];
    total: number
}

export const TaskList = ({ data, total }: TaskListProps) => {
    const workspaceId = useWorkspaceId()
    const { open: createTask } = useCreateTaskModal()
    return (
        <div className=" flex flex-col gap-y-4 col-span-1">
            <div className=" bg-muted rounded-lg p-4">
                <div className=" flex items-center justify-between">
                    <p className=" text-lg font-semibold">
                        Tasks ({total})
                    </p>
                    <Button variant={"muted"} size={"icon"} onClick={createTask}>
                        <PlusIcon className=" size-4 text-neutral-400" />
                    </Button>
                </div>
                <Separator className=" my-4" />
                <ul className=" flex flex-col gap-y-4">
                    {data.map((task) => (
                        <li key={task.$id}>
                            <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                                <Card className=" rounded-lg hover:opacity-75 transition">
                                    <CardContent className=" p-4">
                                        <p className=" text-lg font-medium truncate">
                                            {task.name}
                                        </p>
                                        <div className=" flex items-center gap-x-2">
                                            <p>{task.project?.name}</p>
                                            <div className=" rounded-full size-1 bg-neutral-300" />
                                            <div className=" text-sm text-muted-foreground flex items-center">
                                                <CalendarIcon className=" size-3 mr-1" />
                                                <span className=" truncate">
                                                    {formatDistanceToNow(new Date(task.dueDate))}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </li>
                    ))}
                    <li className=" text-xs text-muted-foreground text-center hidden first-of-type:block">
                        No tasks found
                    </li>
                </ul>
                <Button variant={"muted"} className=" mt-4" asChild>
                    <Link href={`/workspaces/${workspaceId}/tasks`}>
                        Show All
                    </Link>
                </Button>
            </div>
        </div>
    )
}


// PROJECT LIST COMPONENT
import { ProjectType } from "@/features/projects/types"
import ProjectAvatar from "@/features/projects/components/ProjectAvatar"


interface ProjectListProps {
    data: ProjectType[];
    total: number
}

export const ProjectList = ({ data, total }: ProjectListProps) => {
    const workspaceId = useWorkspaceId()
    const { open: createProject } = useCreateProjectModal()
    return (
        <div className=" flex flex-col gap-y-4 col-span-1">
            <div className=" bg-white border rounded-lg p-4">
                <div className=" flex items-center justify-between">
                    <p className=" text-lg font-semibold">
                        Projects ({total})
                    </p>
                    <Button variant={"secondary"} size={"icon"} onClick={createProject}>
                        <PlusIcon className=" size-4 text-neutral-400" />
                    </Button>
                </div>
                <Separator className=" my-4" />
                <ul className=" grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {data.map((project) => (
                        <li key={project.$id}>
                            <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                                <Card className=" rounded-lg hover:opacity-75 transition">
                                    <CardContent className=" p-4 flex items-center gap-x-2.5">
                                        <ProjectAvatar
                                            name={project.name}
                                            image={project.imageUrl}
                                            className=" size-4"
                                            fallbackClassname=" text-lg"
                                        />
                                        <p className=" text-lg font-medium truncate">
                                            {project.name}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        </li>
                    ))}
                    <li className=" text-xs text-muted-foreground text-center hidden first-of-type:block">
                        No projects found
                    </li>
                </ul>
            </div>
        </div>
    )
}



// MEMBER LIST COMPONENT
// import { MemberType } from "@/features/members/types"
import MemberAvatar from "@/features/members/components/MemberAvatar"
import { MemberType } from "@/features/members/types"

interface MemberListProps {
    data: MemberType[]
    total: number
}

export const MemberList = ({ data, total }: MemberListProps) => {
    const workspaceId = useWorkspaceId()
    return (
        <div className=" flex flex-col gap-y-4 col-span-1">
            <div className=" bg-white border rounded-lg p-4">
                <div className=" flex items-center justify-between">
                    <p className=" text-lg font-semibold">
                        Members ({total})
                    </p>
                    <Button asChild variant={"secondary"} size={"icon"}>
                        <Link href={`/workspaces/${workspaceId}/members`}>
                            <SettingsIcon className=" size-4 text-neutral-400" />

                        </Link>
                    </Button>
                </div>
                <Separator className=" my-4" />
                <ul className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.map((member) => (
                        <li key={member.$id}>
                            <Card className=" rounded-lg overflow-hidden">
                                <CardContent className=" p-3 flex flex-col items-center gap-x-2">
                                    <MemberAvatar
                                        name={member.name}
                                        className=" size-12"
                                        fallbackClassname=" text-lg"
                                    />
                                    <div className=" flex flex-col items-center overflow-hidden">
                                        <p className=" text-lg font-medium line-clamp-1">
                                            {member.name}
                                        </p>
                                        <p className=" text-xs text-muted-foreground line-clamp-1">
                                            {member.email}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </li>
                    ))}
                    <li className=" text-xs text-muted-foreground text-center hidden first-of-type:block">
                        No members found
                    </li>
                </ul>
            </div>
        </div>
    )
}