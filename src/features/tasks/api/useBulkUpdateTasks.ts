

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
// import { Models } from "node-appwrite";
import { TaskType } from "../types";
// import { useRouter } from "next/navigation";
import { TaskBulkUpdateSchema } from "@/features/tasks/schemas";

interface RequestProps {
    json: z.infer<typeof TaskBulkUpdateSchema>;
} 
// type ResponseProps = {
//     success: string
// }

type ResType = {data: TaskType[]}
// type ResType = typeof POST: NextResponse<{data: Models.Document}>


export const useBulkUpdateTasks = () => {
    // const router = useRouter()
    const queryClient = useQueryClient()
    const mutation = useMutation<ResType ,Error, RequestProps>({
        mutationFn: async({json}) => {
            const response = await fetch(`http://localhost:3000/api/tasks/bulk-update`, {
                method: 'POST',
                body: JSON.stringify(json)
            })
            // console.log(await response.json())
            const res: {data: TaskType[]} = await response.json()
            // return await response.json();
            return res
        },
        onSuccess: () => {
            toast.success("Tasks updated")
            
            // router.refresh()


            queryClient.invalidateQueries({queryKey: ["tasks"]})
        },
        onError: () => {
            toast.error("Failed to update tasks")
        }
        
    })
    return mutation
}