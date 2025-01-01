import { rootUrl } from "@/lib/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";



interface RequestProps {
    taskId: string
}

type ResType = {data: {$id: string}}


export const useDeleteTask = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation<ResType ,Error, RequestProps>({
        mutationFn: async({taskId}) => {
            const response = await fetch(`${rootUrl}/api/tasks/${taskId}`, {
                method: 'DELETE',
            })
            const res: {data: {$id: string}} = await response.json()
            return res
        },
        onSuccess: ({data}) => {
            toast.success("Task deleted")
            queryClient.invalidateQueries({queryKey: ["tasks"]})
            queryClient.invalidateQueries({queryKey: ["project-analytics"]})
            queryClient.invalidateQueries({queryKey: ["workspace-analytics"]})
            queryClient.invalidateQueries({queryKey: ["task", data.$id]})
        },
        onError: () => {
            toast.error("Failed to delete task")
        }
        
    })
    return mutation
}