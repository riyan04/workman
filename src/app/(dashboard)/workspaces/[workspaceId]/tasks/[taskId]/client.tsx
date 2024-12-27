"use client"

import { PageError } from "@/components/PageError"
import { PageLoader } from "@/components/PageLoader"
import { Separator } from "@/components/ui/separator"
import { useGetTask } from "@/features/tasks/api/useGetTask"
import { TaskBreadCrumbs } from "@/features/tasks/components/TaskBreadCrumbs"
import { TaskDescription } from "@/features/tasks/components/TaskDescription"
import { TaskOverview } from "@/features/tasks/components/TaskOverview"
import { useTaskId } from "@/features/tasks/hooks/useTaskId"

export const TaskIdClient = () => {
    const taskId = useTaskId()
    const {data, isLoading} = useGetTask({taskId})
    if(isLoading){
        return <PageLoader />
    }
    if(!data){
        return (
            <PageError message="Task not found" />
        )
    }
    return(
        <div className=" flex flex-col">
            <TaskBreadCrumbs project={data.project} task={data} />
            <Separator className=" my-6" />
            <div className=" grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TaskOverview task={data} />
                <TaskDescription task={data} />
            </div>
        </div>
    )
}