

// import { POST } from "@/app/api/workspaces/route"
// import { updateWorkspaceSchema } from "../schemas";
import { rootUrl } from "@/lib/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { z } from "zod";
import { toast } from "sonner";
// import { Models } from "node-appwrite";
// import { useRouter } from "next/navigation";



interface RequestProps {
    workspaceId: string
}
// type ResponseProps = {
//     success: string
// }

type ResType = {data: {$id: string}}
// type ResType = typeof POST: NextResponse<{data: Models.Document}>


export const useDeleteWorkspace = () => {
    // const router = useRouter()
    const queryClient = useQueryClient()
    const mutation = useMutation<ResType ,Error, RequestProps>({
        mutationFn: async({workspaceId}) => {
            // const formData = new FormData()
            // formData.append("name", form.name!)
            // formData.append("image", form.image!)
            const response = await fetch(`${rootUrl}/api/workspaces/${workspaceId}`, {
                method: 'DELETE',
                // body: formData
            })
            // console.log(await response.json())
            const res: {data: {$id: string}} = await response.json()
            // console.log(res)
            return res
        },
        onSuccess: ({data}) => {
            toast.success("Workspace deleted")
            // console.log("reached Here, useCreateWorkspace", data.$id)
            // router.push(`/workspaces/${data.$id}`)

            queryClient.invalidateQueries({queryKey: ["workspaces"]})
            queryClient.invalidateQueries({queryKey: ["workspace", data.$id]})
        },
        onError: () => {
            toast.error("Failed to delete workspace")
        }
        
    })
    return mutation
}