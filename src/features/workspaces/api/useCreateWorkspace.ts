

// import { POST } from "@/app/api/workspaces/route"
import { createWorkspaceSchema } from "../schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Models } from "node-appwrite";
import { useRouter } from "next/navigation";
import { rootUrl } from "@/lib/constants";

type RequestProps =  z.infer<typeof createWorkspaceSchema>
// type ResponseProps = {
//     success: string
// }

type ResType = {data: Models.Document}
// type ResType = typeof POST: NextResponse<{data: Models.Document}>


export const useCreateWorkspace = () => {
    const router = useRouter()
    const queryClient = useQueryClient()
    const mutation = useMutation<ResType ,Error, RequestProps>({
        mutationFn: async(form) => {
            const formData = new FormData()
            formData.append("name", form.name)
            formData.append("image", form.image!)
            const response = await fetch(`${rootUrl}/api/workspaces`, {
                method: 'POST',
                body: formData
            })
            // console.log(await response.json())
            const res: {data: Models.Document} = await response.json()
            // return await response.json();
            return res
        },
        onSuccess: ({data}) => {
            toast.success("Workspace created")
            // console.log("reached Here, useCreateWorkspace", data.$id)
            router.push(`/workspaces/${data.$id}`)

            queryClient.invalidateQueries({queryKey: ["workspaces"]})
        },
        onError: () => {
            toast.error("Failed to create workspace")
        }
        
    })
    return mutation
}