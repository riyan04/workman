import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";



interface RequestProps {
    taskId: string
}

type ResType = {data: {$id: string}}


export const useDeleteTask = () => {
    const router = useRouter()
    const queryClient = useQueryClient()
    const mutation = useMutation<ResType ,Error, RequestProps>({
        mutationFn: async({taskId}) => {
            const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
                method: 'DELETE',
            })
            const res: {data: {$id: string}} = await response.json()
            return res
        },
        onSuccess: ({data}) => {
            toast.success("Task deleted")
            router.refresh()
            queryClient.invalidateQueries({queryKey: ["tasks"]})
            queryClient.invalidateQueries({queryKey: ["task", data.$id]})
        },
        onError: () => {
            toast.error("Failed to delete task")
        }
        
    })
    return mutation
}