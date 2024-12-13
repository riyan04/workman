

// import { POST } from "@/app/api/workspaces/route"
// import { updateWorkspaceSchema } from "../schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// import { z } from "zod";
import { toast } from "sonner";
import { Models } from "node-appwrite";
// import { useRouter } from "next/navigation";



interface RequestProps {
    workspaceId: string
}
// type ResponseProps = {
//     success: string
// }

type ResType = {data: Models.Document}
// type ResType = typeof POST: NextResponse<{data: Models.Document}>


export const useResetInviteCode = () => {
    // const router = useRouter()
    const queryClient = useQueryClient()
    const mutation = useMutation<ResType ,Error, RequestProps>({
        mutationFn: async({workspaceId}) => {
            // const formData = new FormData()
            // formData.append("name", form.name!)
            // formData.append("image", form.image!)
            const response = await fetch(`http://localhost:3000/api/workspaces/${workspaceId}/reset-invite-code`, {
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
            // console.log("reached Here, useCreateWorkspace", data.$id)
            // router.push(`/workspaces/${data.$id}`)

            queryClient.invalidateQueries({queryKey: ["workspaces"]})
            queryClient.invalidateQueries({queryKey: ["workspace", data.$id]})
        },
        onError: () => {
            toast.error("Failed to reset invite code of the workspace")
        }
        
    })
    return mutation
}