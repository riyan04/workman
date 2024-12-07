

import { POST } from "@/app/api/workspaces/route"
import { createWorkspaceSchema } from "../schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";

type RequestProps =  z.infer<typeof createWorkspaceSchema>
// type ResponseProps = {
//     success: string
// }

type ResType = typeof POST


export const useCreateWorkspace = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation<ResType ,Error, RequestProps>({
        mutationFn: async(form) => {
            const formData = new FormData()
            formData.append("name", form.name)
            formData.append("image", form.image!)
            const response = await fetch('http://localhost:3000/api/workspaces', {
                method: 'POST',
                body: formData
            })
            // console.log(await response.json())
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Workspace created")
            queryClient.invalidateQueries({queryKey: ["workspaces"]})
        },
        onError: () => {
            toast.error("Failed to create workspace")
        }
        
    })
    return mutation
}