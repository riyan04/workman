

// import { POST } from "@/app/api/workspaces/route"
// import { updateWorkspaceSchema } from "../schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { z } from "zod";
import { toast } from "sonner";
// import { Models } from "node-appwrite";
// import { useRouter } from "next/navigation";



interface RequestProps {
    projectId: string
}
// type ResponseProps = {
//     success: string
// }

type ResType = {data: {$id: string}}
// type ResType = typeof POST: NextResponse<{data: Models.Document}>


export const useDeleteProject = () => {
    // const router = useRouter()
    const queryClient = useQueryClient()
    const mutation = useMutation<ResType ,Error, RequestProps>({
        mutationFn: async({projectId}) => {
            // const formData = new FormData()
            // formData.append("name", form.name!)
            // formData.append("image", form.image!)
            const response = await fetch(`http://localhost:3000/api/projects/${projectId}`, {
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
            // console.log("reached Here, useCreateWorkspace", data.$id)
            // router.push(`/workspaces/${data.$id}`)

            queryClient.invalidateQueries({queryKey: ["projects"]})
            queryClient.invalidateQueries({queryKey: ["project", data.$id]})
        },
        onError: () => {
            toast.error("Failed to delete project")
        }
        
    })
    return mutation
}