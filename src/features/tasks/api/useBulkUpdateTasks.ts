

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { TaskType } from "../types";
import { TaskBulkUpdateSchema } from "@/features/tasks/schemas";

interface RequestProps {
    json: z.infer<typeof TaskBulkUpdateSchema>;
}

type ResType = {data: TaskType[]}


export const useBulkUpdateTasks = () => {
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

            queryClient.invalidateQueries({queryKey: ["tasks"]})
        },
        onError: () => {
            toast.error("Failed to update tasks")
        }
        
    })
    return mutation
}