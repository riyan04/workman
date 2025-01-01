import { useQuery } from "@tanstack/react-query";
import { Models } from "node-appwrite";
import { TaskType, TaskStatus } from "../types";
import { rootUrl } from "@/lib/constants";

interface useGetTasksProps {
    workspaceId: string,
    projectId?: string | null,
    status?: TaskStatus | null,
    assigneeId?: string | null,
    dueDate?: string | null
    search?: string | null
}

export const useGetTasks = ({ workspaceId, projectId, status, assigneeId, dueDate, search }: useGetTasksProps) => {
    let url = `${rootUrl}/api/tasks?workspaceId=${workspaceId}`
    if (projectId) {
        url += `&projectId=${projectId}`
    }
    if (status) {
        url += `&status=${status}`
    }
    if (assigneeId) {
        url += `&assigneeId=${assigneeId}`
    }
    if (dueDate) {
        url += `&dueDate=${dueDate}`
    }
    if (search) {
        url += `&search=${search}`
    }
    const query = useQuery({
        queryKey: ["tasks",
            workspaceId,
            projectId,
            status,
            search,
            assigneeId,
            dueDate
        ],
        queryFn: async () => {
            const res = await fetch(
                url,
                {

                    // method: 'GET',
                    // body: JSON.stringify(workspaceId)

                })
            if (!res.ok) {
                // return null
                // console.log("Res not ok!")
                throw new Error("Failed to fetch tasks")
            }
            const { data }: { data: Models.DocumentList<TaskType> } = await res.json();
            // const { data }: { data: Models.DocumentList<Models.Document> } = await res.json();
            return data;
        }

    })
    return query;
}