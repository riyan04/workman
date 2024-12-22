import { useQuery } from "@tanstack/react-query";
import { Models } from "node-appwrite";

interface useGetTasksProps {
    workspaceId: string
}

export const useGetTasks = ({ workspaceId }: useGetTasksProps) => {
    const query = useQuery({
        queryKey: ["projects", workspaceId],
        queryFn: async () => {
            const res = await fetch(`http://localhost:3000/api/tasks?workspaceId=${workspaceId}`, {
                // method: 'GET',
                // body: JSON.stringify(workspaceId)
                
            })
            if (!res.ok) {
                // return null
                // console.log("Res not ok!")
                throw new Error("Failed to fetch tasks")
            }
            const {data}: {data: Models.DocumentList<Models.Document>} = await res.json();
            return data;
        }

    })
    return query;
}