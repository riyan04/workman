
import { rootUrl } from "@/lib/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";



interface RequestProps {
    memberId: string
}

type ResType = {data: {$id: string}}
// type ResType = typeof POST: NextResponse<{data: Models.Document}>


export const useDeleteMember = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation<ResType ,Error, RequestProps>({
        mutationFn: async({memberId}) => {
            const response = await fetch(`${rootUrl}/api/members/${memberId}`, {
                method: 'DELETE',
                // body: formData
            })
            if(!response.ok){
                toast.error("Failed to delete member")
                
            }
            const res: {data: {$id: string}} = await response.json()
            return res
        },
        onSuccess: () => {
            toast.success("Member deleted")
            // router.push(`/workspaces/${data.$id}`)

            queryClient.invalidateQueries({queryKey: ["members"]})
            // queryClient.invalidateQueries({queryKey: ["member", data.$id]})
        },
        onError: () => {
            toast.error("Failed to delete member")
        }
        
    })
    return mutation
}