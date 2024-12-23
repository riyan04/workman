"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader, PlusIcon } from "lucide-react"
import { useCreateTaskModal } from "../hooks/useCreateTaskModal"
import { useGetTasks } from "../api/useGetTasks"
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId"
import { useQueryState } from "nuqs"
import { DataFilters } from "./DataFilters"
import { useTaskFilters } from "../hooks/useTaskFilters"
import { DataTable } from "./DataTable"
import { Columns } from "./Columns"


const TaskViewSwitcher = () => {
    const [{
        status,
        assigneeId,
        projectId,
        dueDate
    }] = useTaskFilters()
    const [view, setView] = useQueryState("task-view", {
        defaultValue: "table"
    })
    const workspaceId = useWorkspaceId()
    const { open } = useCreateTaskModal()
    const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({ workspaceId, projectId, assigneeId, status, dueDate })

    return (
        <Tabs
            defaultValue={view}
            onValueChange={setView}
            className=" flex-1 w-full border rounded-lg"
        >
            <div className=" h-full flex flex-col overflow-auto p-4">
                <div className=" flex flex-col gap-y-2 lg:flex-row justify-between items-center">
                    <TabsList className="w-full lg:w-auto">
                        <TabsTrigger value="table" className=" h-8 w-full lg:w-auto">
                            Table
                        </TabsTrigger>
                        <TabsTrigger value="kanban" className=" h-8 w-full lg:w-auto">
                            Kanban
                        </TabsTrigger>
                        <TabsTrigger value="calendar" className=" h-8 w-full lg:w-auto">
                            Calendar
                        </TabsTrigger>
                    </TabsList>
                    <Button onClick={open} size={"sm"} className=" w-full lg:w-auto">
                        <PlusIcon className=" size-4" />
                        New
                    </Button>
                </div>
                <Separator className=" my-4" />
                    <DataFilters />
                <Separator className=" my-4" />
                {isLoadingTasks
                    ? (<div className=" w-full rounded-lg h-[200px] flex flex-col items-center justify-center">
                        <Loader className=" size-5 animate-spin text-muted-foreground" />
                    </div>)
                    : (
                        <>
                            <TabsContent value="table" className=" mt-0">
                                <DataTable columns={Columns} data={tasks?.documents ?? []} />
                            </TabsContent>
                            <TabsContent value="kanban" className=" mt-0">
                                {JSON.stringify(tasks)}
                            </TabsContent>
                            <TabsContent value="calendar" className=" mt-0">
                                {JSON.stringify(tasks)}
                            </TabsContent>
                        </>
                    )
                }
            </div>
        </Tabs>
    )
}

export default TaskViewSwitcher