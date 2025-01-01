

// import { POST } from "@/app/api/workspaces/route"
// import { updateWorkspaceSchema } from "../schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// import { z } from "zod";
import { toast } from "sonner";
// import { Models } from "node-appwrite";
import { WorkspaceType } from "../types";
import { useRouter } from "next/navigation";
import { rootUrl } from "@/lib/constants";



interface RequestProps {
    code: string;
    workspaceId: string;
}
// type ResponseProps = {
//     success: string
// }

type ResType = {data: WorkspaceType}
// type ResType = typeof POST: NextResponse<{data: Models.Document}>


export const useJoinWorkspace = () => {
    const router = useRouter()
    const queryClient = useQueryClient()
    const mutation = useMutation<ResType ,Error, RequestProps>({
        mutationFn: async({code ,workspaceId}) => {
            const response = await fetch(`${rootUrl}/api/workspaces/${workspaceId}/join`, {
                method: 'POST',
                body: JSON.stringify({code: code})
            })
            // console.log(await response.json())
            const res: {data: WorkspaceType} = await response.json()
            // console.log(res)
            return res
        },
        onSuccess: ({data}) => {
            toast.success("Joined workspace")
            // console.log("reached Here, useCreateWorkspace", data.$id)
            router.push(`/workspaces/${data.$id}`)

            queryClient.invalidateQueries({queryKey: ["workspaces"]})
            queryClient.invalidateQueries({queryKey: ["workspace", data.$id]})
        },
        onError: () => {
            toast.error("Failed to join workspace")
        }
        
    })
    return mutation
}