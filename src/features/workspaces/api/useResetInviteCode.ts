
import { useMutation, useQueryClient } from "@tanstack/react-query";

// import { z } from "zod";
import { toast } from "sonner";
import { Models } from "node-appwrite";
import { rootUrl } from "@/lib/constants";



interface RequestProps {
    workspaceId: string
}

type ResType = {data: Models.Document}


export const useResetInviteCode = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation<ResType ,Error, RequestProps>({
        mutationFn: async({workspaceId}) => {
            // const formData = new FormData()
            // formData.append("name", form.name!)
            // formData.append("image", form.image!)
            const response = await fetch(`${rootUrl}/api/workspaces/${workspaceId}/reset-invite-code`, {
                method: 'POST',
                // body: formData
            })
            // console.log(await response.json())
            const res: {data: Models.Document} = await response.json()
            // console.log(res)
            return res
        },
        onSuccess: ({data}) => {
            toast.success("Workspace invite code reset succesfull")
            queryClient.invalidateQueries({queryKey: ["workspaces"]})
            queryClient.invalidateQueries({queryKey: ["workspace", data.$id]})
        },
        onError: () => {
            toast.error("Failed to reset invite code of the workspace")
        }
        
    })
    return mutation
}