import { ProjectAnalyticsType } from "@/features/projects/types"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { AnalyticsCard } from "./AnalyticsCard"



interface AnalyticsProps {
    data: ProjectAnalyticsType
}

export const Analytics = ({ data }: AnalyticsProps) => {

    return (
        <ScrollArea className=" border rounded-lg w-full whitespace-nowrap shrink-0">
            <div className=" w-full flex flex-row">
                <div className=" flex items-center flex-1">
                    <AnalyticsCard
                        title="Total Tasks"
                        value={data.taskCount}
                        variant={data.taskDifference > 0 ? "up" : "down"}
                        increaseValue={data.taskDifference}
                    />
                </div>
                <div className=" flex items-center flex-1">
                    <AnalyticsCard
                        title="Assigned Tasks"
                        value={data.assignedTaskCount}
                        variant={data.assignedTaskDifference > 0 ? "up" : "down"}
                        increaseValue={data.assignedTaskCount}
                    />
                </div>
                <div className=" flex items-center flex-1">
                    <AnalyticsCard
                        title="Completed Tasks"
                        value={data.completedTaskCount}
                        variant={data.completedTaskDifference > 0 ? "up" : "down"}
                        increaseValue={data.completedTaskDifference}
                    />
                </div>
                <div className=" flex items-center flex-1">
                    <AnalyticsCard
                        title="Over-due Tasks"
                        value={data.overDueTaskCount}
                        variant={data.overDueTaskDifference > 0 ? "up" : "down"}
                        increaseValue={data.overDueTaskDifference}
                    />
                </div>
                <div className=" flex items-center flex-1">
                    <AnalyticsCard
                        title="Incomplete Tasks"
                        value={data.incompleteTaskCount!}
                        variant={data.incompleteTaskDifference! > 0 ? "up" : "down"}
                        increaseValue={data.incompleteTaskCount!}
                    />
                </div>
            </div>
            <ScrollBar orientation={"horizontal"} />
        </ScrollArea>
    )
}

