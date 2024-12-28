

// import { POST } from "@/app/api/workspaces/route"
import { createTaskSchema } from "../schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
// import { Models } from "node-appwrite";
import { TaskType } from "../types";

interface RequestProps {
    json: z.infer<typeof createTaskSchema>;
    taskId: string
} 
// type ResponseProps = {
//     success: string
// }

type ResType = {data: TaskType}
// type ResType = typeof POST: NextResponse<{data: Models.Document}>


export const useUpdateTask = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation<ResType ,Error, RequestProps>({
        mutationFn: async({json, taskId}) => {
            const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
                method: 'PATCH',
                body: JSON.stringify(json)
            })
            // console.log(await response.json())
            const res: {data: TaskType} = await response.json()
            // return await response.json();
            return res
        },
        onSuccess: ({data}) => {
            toast.success("Task updated")


            queryClient.invalidateQueries({queryKey: ["tasks"]})
            queryClient.invalidateQueries({queryKey: ["project-analytics"]})
            queryClient.invalidateQueries({queryKey: ["workspace-analytics"]})
            queryClient.invalidateQueries({queryKey: ["task", data.$id]})
        },
        onError: () => {
            toast.error("Failed to update task")
        }
        
    })
    return mutation
}