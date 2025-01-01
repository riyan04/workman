
import { rootUrl } from "@/lib/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";



interface RequestProps {
    projectId: string
}


type ResType = {data: {$id: string}}


export const useDeleteProject = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation<ResType ,Error, RequestProps>({
        mutationFn: async({projectId}) => {
            const response = await fetch(`${rootUrl}/api/projects/${projectId}`, {
                method: 'DELETE',
                // body: formData
            })
            // console.log(await response.json())
            const res: {data: {$id: string}} = await response.json()
            // console.log(res)
            return res
        },
        onSuccess: ({data}) => {
            toast.success("Project deleted")

            queryClient.invalidateQueries({queryKey: ["projects"]})
            queryClient.invalidateQueries({queryKey: ["project", data.$id]})
        },
        onError: () => {
            toast.error("Failed to delete project")
        }
        
    })
    return mutation
}