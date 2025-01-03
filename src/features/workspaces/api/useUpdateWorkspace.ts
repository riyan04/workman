
import { updateWorkspaceSchema } from "../schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Models } from "node-appwrite";
import { rootUrl } from "@/lib/constants";



interface RequestProps {
    form: z.infer<typeof updateWorkspaceSchema>;
    workspaceId: string
}

type ResType = {data: Models.Document}


export const useUpdateWorkspace = () => {
    // const router = useRouter()
    const queryClient = useQueryClient()
    const mutation = useMutation<ResType ,Error, RequestProps>({
        mutationFn: async({form, workspaceId}) => {
            const formData = new FormData()
            formData.append("name", form.name!)
            formData.append("image", form.image!)
            const response = await fetch(`${rootUrl}/api/workspaces/${workspaceId}`, {
                method: 'PATCH',
                body: formData
            })
            // console.log(await response.json())
            const res: {data: Models.Document} = await response.json()
            console.log(res)
            return res
        },
        onSuccess: ({data}) => {
            toast.success("Workspace updated")

            queryClient.invalidateQueries({queryKey: ["workspaces"]})
            queryClient.invalidateQueries({queryKey: ["workspace", data.$id]})
        },
        onError: () => {
            toast.error("Failed to update workspace")
        }
        
    })
    return mutation
}