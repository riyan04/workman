

// import { POST } from "@/app/api/workspaces/route"
import { createProjectSchema } from "../schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Models } from "node-appwrite";
import { rootUrl } from "@/lib/constants";

type RequestProps =  z.infer<typeof createProjectSchema>
// type ResponseProps = {
//     success: string
// }

type ResType = {data: Models.Document}
// type ResType = typeof POST: NextResponse<{data: Models.Document}>


export const useCreateProject = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation<ResType ,Error, RequestProps>({
        mutationFn: async(form) => {
            const formData = new FormData()
            formData.append("name", form.name)
            formData.append("image", form.image!)
            formData.append("workspaceId", form.workspaceId)
            const response = await fetch(`${rootUrl}/api/projects`, {
                method: 'POST',
                body: formData
            })
            // console.log(await response.json())
            const res: {data: Models.Document} = await response.json()
            // return await response.json();
            return res
        },
        onSuccess: () => {
            toast.success("Project created")
            // console.log("reached Here, useCreateWorkspace", data.$id)


            // TODO:  redirect to project screen


            queryClient.invalidateQueries({queryKey: ["projects"]})
        },
        onError: () => {
            toast.error("Failed to create project")
        }
        
    })
    return mutation
}