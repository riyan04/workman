import { rootUrl } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
// import { Models } from "node-appwrite";
// import { TaskType, TaskStatus } from "../types";

interface useGetTaskProps {
    taskId: string
}

export const useGetTask = ({ taskId }: useGetTaskProps) => {
    // const url = `http://localhost:3000/api/tasks?taskId=${taskId}`
    
    const query = useQuery({
        queryKey: ["task",
            taskId
        ],
        queryFn: async () => {
            const res = await fetch(`${rootUrl}/api/tasks/${taskId}`)
            if (!res.ok) {
                // return null
                // console.log("Res not ok!")
                throw new Error("Failed to fetch task")
            }
            const  {data}  = await res.json();
            // const { data }: { data: Models.DocumentList<TaskType> } = await res.json();
            // const { data }: { data: Models.DocumentList<Models.Document> } = await res.json();
            
            return data;
        }

    })
    return query;
}